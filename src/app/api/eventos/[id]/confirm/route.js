import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  const participacaoId = Number(params?.id);  

  if (!participacaoId) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const update = await prisma.participacao.update({
      where: { id: participacaoId },
      data: {
        status: 'confirmed',
        confirmedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, update });
  } catch (error) {
    console.error('Erro ao confirmar participação:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
