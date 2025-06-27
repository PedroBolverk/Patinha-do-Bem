import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { generatePixPayload } from '@/utils/pix';
import { formatCurrency } from '@/utils/format';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { eventoId, nome, email, whatsapp, valorEvento } = await req.json();

    // Logar os dados recebidos
    console.log('Dados recebidos:', {
      eventoId,
      nome,
      email,
      whatsapp,
      valorEvento,
    });

    // Verificar se os dados essenciais foram enviados
    if (!eventoId || !nome || !email || valorEvento === undefined) {
      return new Response(JSON.stringify({ error: 'Dados incompletos' }), { status: 400 });
    }

    // Buscar o evento no banco de dados para pegar o valor
    const evento = await prisma.events.findUnique({
      where: { id: parseInt(eventoId) },
      include: { 
        organizador: true  // Inclui o organizador
      },
    });

    if (!evento || !evento.organizador?.pix) {
      return NextResponse.json({ error: 'Campanha ou chave Pix não encontrada' }, { status: 400 });
    }

    const valorNumerico = parseFloat(Number(valorEvento).toFixed(2));

    // 🧼 Nome do recebedor (sem acentos, em caixa alta)
    const sanitizedName = evento.organizador?.name
      ?.toUpperCase()
      .substring(0, 25)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const descricaoPix = `Doação ${evento.titulo}`.substring(0, 30);

    // Se o evento não for encontrado, retorne um erro
    if (!evento) {
      return new Response(JSON.stringify({ error: 'Evento não encontrado' }), { status: 404 });
    }

    // Agora, se o valorEvento não for passado, use o valor do evento
    const valorFinal = valorEvento || evento.valorEvento;

    // Criar a participação com o valor do evento
    const participacao = await prisma.participacao.create({
      data: {
        nome,
        email,
        whatsapp,
        valorEvento: valorFinal,
        status: 'pending',  // Certifique-se de que o valor do evento está sendo salvo
        dataHora: new Date(),
        evento: {
          connect: { id: parseInt(eventoId) },  // Conecta a participação com o evento
        },
      },
    });

    // Gerar o Payload (por exemplo, um código único para a participação)
    const payload = generatePixPayload({
      pixKey: evento.organizador?.pix,
      amount: valorNumerico,
      merchantName: sanitizedName,
    });

    // Exemplo de payload gerado
    const phone = evento.organizador?.whatsapp?.replace(/\D/g, '') || '';
    const valorFormatado = formatCurrency(valorNumerico);
    const confirmUrl = `https://seusite.com/confirmar-doacao/${evento.id}`;
    const msg = `Olá! Fiz uma doação de ${valorFormatado} para sua campanha "${evento.titulo}". Pode confirmar o recebimento aqui: ${confirmUrl}`;
    const whatsappLink = `https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`;

    return NextResponse.json({
      success: true,
      payload,
      whatsappLink,
      donationId: participacao.id,
    });

  } catch (error) {
    console.error('Erro ao processar doação:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let whereClause = {};

    if (userId) {
      // Buscar IDs dos eventos criados por esse organizador
      const eventosDoOrganizador = await prisma.events.findMany({
        where: { organizadorId: Number(userId) },
        select: { id: true },
      });

      const idsEventos = eventosDoOrganizador.map(e => e.id);

      // Se não houver eventos, evita buscar participações desnecessárias
      if (idsEventos.length === 0) {
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      whereClause = {
        eventoId: { in: idsEventos },
      };
    }

    const participacoes = await prisma.participacao.findMany({
      where: whereClause,
      orderBy: { dataHora: 'desc' },
      include: {
        evento: {
          select: {
            titulo: true,
            dataIni: true,
            dataFim: true,
            local: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(participacoes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Erro ao buscar participações:', err);
    return new Response(JSON.stringify({ error: 'Erro interno' }), { status: 500 });
  }
}
