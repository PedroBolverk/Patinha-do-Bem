import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  const { name, username, email, password } = await req.json();

  if (!email || !password || !name || !username) {
    return new Response(JSON.stringify({ error: 'Campos obrigatórios faltando' }), {
      status: 400,
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return new Response(JSON.stringify({ error: 'Usuário já existe' }), {
      status: 409,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    return new Response(JSON.stringify(newUser), {
      status: 201,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Erro ao criar usuário' }), {
      status: 500,
    });
  }
}
