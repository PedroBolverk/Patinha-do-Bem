import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import cloudinary from '../../../../lib/cloudinary';
import { Readable } from 'stream';

const prisma = new PrismaClient();

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get('name');
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const file = formData.get('imagem');
    const rawRole = formData.get('role');
    const role = rawRole?.toString().trim().toUpperCase();

    // ✅ Validações obrigatórias
    if (!name || !username || !email || !password) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios faltando' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (role !== 'ORGANIZADOR' && role !== 'COMUM') {
      return new Response(
        JSON.stringify({ error: 'Tipo de usuário inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ✅ Evita duplicidade
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Usuário já registrado com esse e-mail' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ✅ Upload de imagem (se houver)
    let imageUrl = null;
    if (file && typeof file.name === 'string') {
      const buffer = Buffer.from(await file.arrayBuffer());

      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'users' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        bufferToStream(buffer).pipe(uploadStream);
      });
    }

    // ✅ Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Criação do usuário
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role,
        image: imageUrl,
      },
    });

    return new Response(
      JSON.stringify({
        message: 'Usuário criado com sucesso',
        imageUrl: imageUrl,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[REGISTRO_ERROR]', err);
    return new Response(
      JSON.stringify({ error: 'Erro ao criar usuário' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
