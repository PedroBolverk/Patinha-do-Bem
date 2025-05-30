import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { eventoId, nome, email } = await req.json();

    if (!eventoId || !nome || !email) {
      return new Response(JSON.stringify({ error: 'Dados incompletos' }), { status: 400 });
    }

    const participacao = await prisma.participacao.create({
      data: {
        eventoId: parseInt(eventoId),
        nome,
        email,
        dataHora: new Date(), // explícito, opcional
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


export async function GET() {
  try {
    const participacoes = await prisma.participacao.findMany({
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
