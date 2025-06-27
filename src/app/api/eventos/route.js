import AsyncRetry from "async-retry";
import cloudinary from "../../../../lib/cloudinary";
import { Readable } from "stream";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOption";
import { headers } from "next/headers";

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    let whereClause = userId ? { organizadorId: Number(userId) } : {};
      if (userId) {
      const session = await getServerSession({ req: { headers: headers() }, ...authOptions });

      if (!session || session.user?.id !== Number(userId)) {
        return new Response(JSON.stringify({ error: 'Acesso não autorizado' }), { status: 401 });
      }

      whereClause = { organizadorId: Number(userId) };
    }

    const eventos = await AsyncRetry(() =>
      prisma.events.findMany({
        where: whereClause,
        include: {
        organizador: true,
        participacoes: true,
      },
        orderBy: { dataIni: 'asc' },
      }), { retries: 3, minTimeout: 500 }
    );

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
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Usuário não autenticado' }), { status: 401 });
    }

    const formData = await request.formData();
    const titulo = formData.get('titulo');
    const descricao = formData.get('descricao');
    const dataIni = formData.get('dataIni');
    const dataFim = formData.get('dataFim');
    const local = formData.get('local');
    const imagem = formData.get('imagem');
    const valorEvento = formData.get('valorEvento');

    if (!titulo || !descricao || !valorEvento) {
      return new Response(JSON.stringify({ error: "Dados obrigatórios ausentes" }), { status: 400 });
    }

    let imagePath = null;

    if (imagem && typeof imagem.name === 'string') {
      const buffer = Buffer.from(await imagem.arrayBuffer());
      imagePath = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'eventos' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        bufferToStream(buffer).pipe(uploadStream);
      });
    }

    const novoEvento = await AsyncRetry(() =>
      prisma.events.create({
        data: {
          titulo: String(titulo),
          valorEvento: Number(valorEvento),
          descricao: String(descricao),
          dataIni: new Date(dataIni),
          dataFim: new Date(dataFim),
          local: String(local),
          imagem: imagePath ?? '',
          organizadorId: Number(userId),
        },
      }), { retries: 3, minTimeout: 500 }
    );

    return new Response(JSON.stringify(novoEvento), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro ao salvar evento:', error);
    return new Response(JSON.stringify({ error: 'Erro ao salvar evento', details: error.message }), { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID obrigatório' }), { status: 400 });
    }

    await AsyncRetry(() =>
      prisma.events.delete({ where: { id } }), { retries: 3, minTimeout: 500 }
    );

    return new Response(JSON.stringify({ message: 'Evento deletado com sucesso' }), { status: 200 });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    return new Response(JSON.stringify({ error: 'Erro ao deletar' }), { status: 500 });
  }
}
