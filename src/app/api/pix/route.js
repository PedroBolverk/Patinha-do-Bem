import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // ✅ Corrigido: era 'routes'
import prisma from "../../../../lib/prisma"; // ✅ Certifique-se que o caminho está correto

// Atualiza chave PIX
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const formData = await req.formData();
    const pix = formData.get('pix');

    if (!pix || typeof pix !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Chave PIX não fornecida ou inválida' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { pix: pix.trim() },
    });

    return new Response(
      JSON.stringify({ message: 'Chave PIX atualizada com sucesso' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[UPDATE_PIX_ERROR]', err);
    return new Response(
      JSON.stringify({ error: 'Erro ao atualizar chave PIX' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Retorna chave PIX
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { pix: true },
    });

    return new Response(
      JSON.stringify({ pixKey: user?.pix || '' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[GET_PIX_ERROR]', err);
    return new Response(
      JSON.stringify({ error: 'Erro ao recuperar chave PIX' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
