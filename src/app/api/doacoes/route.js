// src/app/api/doacoes/route.js
import { PrismaClient } from "@prisma/client";
import AsyncRetry from "async-retry";

// Inicialize o Prisma Client aqui
const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const doacoes = await prisma.post.findMany({
      where: userId ? { authorId: Number(userId) } : undefined,
      include: {
        author: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return new Response(JSON.stringify(doacoes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao buscar doações:', error);
    return new Response(JSON.stringify({ error: 'Erro interno' }), { status: 500 });
  }
}


export async function POST(request) {
  try {
    const formData = await request.formData(); 

    const titulo = formData.get('titulo');
    const descricao = formData.get('descricao');
    const meta = formData.get('meta');
    const name = formData.get('name');
    const imagem = formData.get('imagem');

    if (!titulo || !descricao || !meta || !name) {
      return new Response(JSON.stringify({ error: 'Dados obrigatórios ausentes' }), { status: 400 });
    }

    const user = await AsyncRetry(async () => {
      let user = await prisma.user.findFirst({ where: { name } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            username: name.toLowerCase().replace(/\s+/g, ''),
            email: `${name.toLowerCase().replace(/\s+/g, '')}@email.com`,
            password: 'senha123',
          },
        });
      }
      return user;
    }, { retries: 3 });


    const novaDoacao = await prisma.post.create({
      data: {
        titulo,
        descricao,
        meta: Number(meta),
        atual: 0,
        authorId: user.id,
      },
    });

    return new Response(JSON.stringify(novaDoacao), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro ao salvar doação:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao salvar doação', details: error.message }),
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

    // Retry para deletar post
    await AsyncRetry(async () => {
      await prisma.post.delete({
        where: { id },
      });
    }, {
      retries: 3,
      minTimeout: 1000,
      maxTimeout: 5000,
      factor: 2,
    });

    return new Response(JSON.stringify({ message: 'Post deletado com sucesso' }), { status: 200 });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    return new Response(JSON.stringify({ error: 'Erro ao deletar' }), { status: 500 });
  }
}
