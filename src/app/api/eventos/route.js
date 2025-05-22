import { PrismaClient } from "@prisma/client";
import AsyncRetry from "async-retry";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const eventos = await AsyncRetry(async () => {
      return await prisma.events.findMany({
        // Removido include do organizador, pois não existe mais
        orderBy: { dataIni: 'asc' },
      });
    }, {
      retries: 3,
      minTimeout: 500,
    });

    return new Response(JSON.stringify(eventos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao buscar eventos', error);
    return new Response(JSON.stringify({ message: 'Erro ao buscar eventos' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { titulo, descricao, dataIni, dataFim, local } = body;

    const novoEvento = await AsyncRetry(async () => {
      return await prisma.events.create({
        data: {
          titulo,
          descricao,
          dataIni: new Date(dataIni),
          dataFim: new Date(dataFim),
          local,
          // organizadorId removido
        },
      });
    }, {
      retries: 3,
      minTimeout: 500,
    });

    return new Response(JSON.stringify(novoEvento), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao salvar evento:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao salvar evento', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID obrigatório' }), { status: 400 });
    }

    await AsyncRetry(async () => {
      await prisma.events.delete({ where: { id } });
    }, {
      retries: 3,
      minTimeout: 500,
    });

    return new Response(JSON.stringify({ message: 'Evento deletado com sucesso' }), { status: 200 });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    return new Response(JSON.stringify({ error: 'Erro ao deletar' }), { status: 500 });
  }
}
