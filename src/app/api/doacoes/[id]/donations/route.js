import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const postId = parseInt(params.id);

  if (isNaN(postId)) {
    return new Response(JSON.stringify({ error: 'ID inválido' }), { status: 400 });
  }

  try {
    const donations = await prisma.donation.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
    });

    return new Response(JSON.stringify(donations), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao buscar doações do post:', error);
    return new Response(JSON.stringify({ error: 'Erro interno' }), { status: 500 });
  }
}
