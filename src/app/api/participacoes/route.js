import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { eventoId, nome, email, whatsapp } = await req.json();

    if (!eventoId || !nome || !email) {
      return new Response(JSON.stringify({ error: 'Dados incompletos' }), { status: 400 });
    }

    const participacao = await prisma.participacao.create({
      data: {
        eventoId: parseInt(eventoId),
        nome,
        email,
        whatsapp,
        dataHora: new Date(),
      },
    });

    return new Response(JSON.stringify(participacao), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Erro ao registrar participação:', err);
    return new Response(JSON.stringify({ error: 'Erro interno' }), { status: 500 });
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
