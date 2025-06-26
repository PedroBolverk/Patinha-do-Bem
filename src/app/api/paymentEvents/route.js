import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generatePixPayload } from '@/utils/pix';  // Função para gerar o payload Pix
import { formatCurrency } from '@/utils/format';  // Função para formatar o valor como moeda

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { eventoId, nome, email, whatsapp } = body;

    if (!eventoId) {
      return NextResponse.json({ error: 'Evento inválido' }, { status: 400 });
    }

    const evento = await prisma.events.findUnique({
      where: { id: eventoId },
      include: { organizador: true },  // Inclui o organizador do evento (dono)
    });

    if (!evento || !evento.organizador?.pix) {
      return NextResponse.json({ error: 'Evento ou chave Pix não encontrada' }, { status: 400 });
    }

    const valorNumerico = parseFloat(Number(evento.valor).toFixed(2));

    const sanitizedName = evento.organizador.name
      ?.toUpperCase()
      .substring(0, 25)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const payload = generatePixPayload({
      pixKey: evento.organizador.pix,
      amount: valorNumerico,
      merchantName: sanitizedName,
    });

    const participacao = await prisma.participacao.create({
      data: {
        nome,
        email,
        whatsapp,
        eventoId: evento.id,
        dataHora: new Date(),
        amount: valorNumerico, // Armazenando o valor da participação
      }
    });

    const phone = evento.organizador.whatsapp?.replace(/\D/g, '') || '';
    const valorFormatado = formatCurrency(valorNumerico);
    const confirmUrl = `https://seusite.com/confirmar-participacao/${participacao.id}`;
    const msg = `Olá! Fiz uma inscrição de ${valorFormatado} para o evento "${evento.titulo}". Pode confirmar o recebimento aqui: ${confirmUrl}`;
    const whatsappLink = `https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`;

    return NextResponse.json({
      success: true,
      payload,
      whatsappLink,
      participacaoId: participacao.id,
    });

  } catch (error) {
    console.error('Erro ao processar evento:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
