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

    const userId = formData.get('userId'); // usado para atualização
    const name = formData.get('name');
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const file = formData.get('imagem');
    const rawRole = formData.get('role');
    const cidade = formData.get('cidade');
    const estado = formData.get('estado');
    const pix = formData.get('pix');
    const role = rawRole?.toString().trim().toUpperCase();
    const whatsapp = formData.get('whatsapp')?.replace(/\D/g, '') || null;

    // ✅ Validação de role
    if (role && role !== 'ORGANIZADOR' && role !== 'COMUM') {
      return new Response(
        JSON.stringify({ error: 'Tipo de usuário inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ✅ Se for update
    if (userId) {
      const updateData = { name, email, whatsapp, cidade, estado, pix };

      if (file && typeof file.name === 'string') {
        const buffer = Buffer.from(await file.arrayBuffer());
        const imageUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'users' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          bufferToStream(buffer).pipe(uploadStream);
        });
        updateData.image = imageUrl;
      }

      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: updateData,
      });

      return new Response(
        JSON.stringify({ message: 'Dados atualizados com sucesso' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ✅ Cadastro
    if (!name || !username || !email || !password) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios faltando' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Usuário já registrado com esse e-mail' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role,
        image: imageUrl,
        estado,
        cidade,
        whatsapp,
        pix,
      },
    });

    return new Response(
      JSON.stringify({ message: 'Usuário criado com sucesso', imageUrl }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[USER_POST_ERROR]', err);
    return new Response(
      JSON.stringify({ error: 'Erro interno ao processar solicitação' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
