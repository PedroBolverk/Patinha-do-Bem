import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/routes';
import prisma from '../../../../lib/prisma'; // Certifique-se de que esse caminho está correto

export async function POST(req) {
  try {
    // Obter a sessão do usuário
    const session = await getServerSession(authOptions);

    // Verifique se a sessão está disponível
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Captura a chave PIX da requisição
    const formData = await req.formData();
    const pix = formData.get('pix');

    // Verifica se a chave PIX foi fornecida
    if (!pix) {
      return new Response(
        JSON.stringify({ error: 'Chave PIX não fornecida' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Atualiza a chave PIX no banco de dados
    await prisma.user.update({
      where: { id: session.user.id },
      data: { pix }, // Atualiza a chave PIX do usuário
    });

    // Retorna resposta de sucesso
    return new Response(
      JSON.stringify({ message: 'Chave PIX atualizada com sucesso' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[UPDATE_PIX_ERROR]', err);
    // Retorna erro interno 500 em caso de falha no servidor
    return new Response(
      JSON.stringify({ error: 'Erro ao atualizar chave PIX' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { pix: true }, // Only fetch the PIX key
    });

    if (!user || !user.pix) {
      return new Response(
        JSON.stringify({ error: 'Chave PIX não encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ pixKey: user.pix }),
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