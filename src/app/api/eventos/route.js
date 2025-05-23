import { PrismaClient } from "@prisma/client";
import AsyncRetry from "async-retry";
import { writeFile } from "fs/promises";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const eventos = await AsyncRetry(async () => {
      return await prisma.events.findMany({
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
    const formData = await request.formData();

    const titulo = formData.get('titulo');
    const descricao = formData.get('descricao');
    const dataIni = formData.get('dataIni');
    const dataFim = formData.get('dataFim');
    const local = formData.get('local');
    const imagem = formData.get('imagem'); // objeto File

    let imagePath = null;

    if (imagem && typeof imagem.name === 'string') {
      const buffer = Buffer.from(await imagem.arrayBuffer());
      const fileName = `evento-${Date.now()}-${imagem.name}`;
      const filePath = `./public/uploads/${fileName}`;

      await writeFile(filePath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    const novoEvento = await AsyncRetry(async () => {
      return await prisma.events.create({
        data: {
          titulo: String(titulo),
          descricao: String(descricao),
          dataIni: new Date(dataIni),
          dataFim: new Date(dataFim),
          local: String(local),
          imagem: imagePath ?? '', // garante string mesmo se null
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
