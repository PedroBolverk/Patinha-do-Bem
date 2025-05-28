import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get('name');
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const file = formData.get('imagem');

    if (!email || !password || !name || !username) {
      return new Response(JSON.stringify({ error: 'Campos obrigatórios faltando' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Usuário já existe' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let imageUrl = null;

    if (file && typeof file.name === 'string') {
      const originalName = file.name.replace(/\s+/g, '-');
      const fileName = `${Date.now()}-${originalName}`;
      const filePath = path.join(process.cwd(), 'public/uploads', fileName);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      imageUrl = `/uploads/${fileName}`;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        image: imageUrl,
      },
    });

    return new Response(JSON.stringify({ message: 'Usuário criado com sucesso', imageUrl }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[REGISTRO_ERROR]', err);
    return new Response(JSON.stringify({ error: 'Erro ao criar usuário' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
