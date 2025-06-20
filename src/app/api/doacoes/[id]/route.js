import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request, context) {
  const { id } = await context.params; // <- EVITA O WARNING
  const numericId = parseInt(id);

  try {
    const post = await prisma.post.findUnique({
      where: { id: numericId },
      include: { author: true },
    });

    if (!post) {
      return new Response(JSON.stringify({ error: 'Post não encontrado' }), { status: 404 });
    }

    const totalArrecadado = await prisma.donation.aggregate({
      where: { postId: numericId },
      _sum: { amount: true }, // ajuste para seu campo correto
    });

    const atual = totalArrecadado._sum.amount || 0;

    return new Response(
      JSON.stringify({ ...post, atual }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Erro interno' }), { status: 500 });
  }
}
