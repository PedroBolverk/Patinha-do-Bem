import { PrismaClient } from "@prisma/client";
import AsyncRetry from "async-retry";
import cloudinary from "../../../../lib/cloudinary";
import { Readable } from "stream";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/routes";
import { headers } from "next/headers"; // ✅ IMPORTANTE para App Router

const prisma = new PrismaClient();

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const whereClause = userId ? { authorId: Number(userId) } : undefined;

    const doacoes = await prisma.post.findMany({
      where: whereClause,
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });

    return new Response(JSON.stringify(doacoes), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao buscar doações:", error);
    return new Response(JSON.stringify({ error: "Erro interno" }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession({ req: { headers: headers() }, ...authOptions }); // ✅ Correto no App Router

    if (!session || !session.user?.id) {
      console.log("❌ Sessão ausente ou inválida:", session);
      return new Response(JSON.stringify({ error: "Usuário não autenticado" }), { status: 401 });
    }

    const formData = await request.formData();
    const titulo = formData.get("titulo");
    const descricao = formData.get("descricao");
    const meta = formData.get("meta");
    const imagem = formData.get("imagem");

    if (!titulo || !descricao || !meta) {
      return new Response(JSON.stringify({ error: "Dados obrigatórios ausentes" }), { status: 400 });
    }

    let imagePath = null;

    if (imagem && typeof imagem.name === "string") {
      const buffer = Buffer.from(await imagem.arrayBuffer());

      imagePath = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "doacoes" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        bufferToStream(buffer).pipe(uploadStream);
      });
    }

    const novaDoacao = await prisma.post.create({
      data: {
        titulo,
        descricao,
        meta: Number(meta),
        atual: 0,
        authorId: session.user.id, // ✅ agora corretamente com usuário autenticado
        imagem: imagePath ?? "",
      },
    });

    return new Response(JSON.stringify(novaDoacao), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao salvar doação:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao salvar doação", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return new Response(JSON.stringify({ error: "ID obrigatório" }), { status: 400 });
    }

    await AsyncRetry(async () => {
      await prisma.post.delete({ where: { id } });
    }, {
      retries: 3,
      minTimeout: 1000,
      maxTimeout: 5000,
      factor: 2,
    });

    return new Response(JSON.stringify({ message: "Post deletado com sucesso" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao deletar post:", error);
    return new Response(JSON.stringify({ error: "Erro ao deletar" }), { status: 500 });
  }
}
