import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return new Response(JSON.stringify({ error: 'Credenciais inválidas' }), {
      status: 401,
    });
  }

  return new Response(
    JSON.stringify({
      name: user.name,
      id: user.id,
      image: user.image || null // adiciona a imagem
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
