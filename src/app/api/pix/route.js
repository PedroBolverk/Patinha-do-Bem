import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { headers, cookies } from "next/headers";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

// ✅ Recuperar sessão com contexto no App Router
async function getSessionWithContext() {
  return await getServerSession({ req: { headers: headers(), cookies: cookies() }, ...authOptions });
}

// ✅ [GET] Obter chave PIX
export async function GET() {
  try {
    const session = await getSessionWithContext();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { pix: true },
    });

    return NextResponse.json({ pixKey: user?.pix || "" }, { status: 200 });
  } catch (err) {
    console.error("[GET_PIX_ERROR]", err);
    return NextResponse.json({ error: "Erro ao recuperar chave PIX" }, { status: 500 });
  }
}

// ✅ [POST] Atualizar chave PIX
export async function POST(req) {
  try {
    const session = await getSessionWithContext();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const formData = await req.formData();
    const pix = formData.get("pix");

    if (!pix || typeof pix !== "string") {
      return NextResponse.json({ error: "Chave PIX inválida" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { pix: pix.trim() },
    });

    return NextResponse.json({ message: "Chave PIX atualizada com sucesso" }, { status: 200 });
  } catch (err) {
    console.error("[UPDATE_PIX_ERROR]", err);
    return NextResponse.json({ error: "Erro ao atualizar chave PIX" }, { status: 500 });
  }
}
