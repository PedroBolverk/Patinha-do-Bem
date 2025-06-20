import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  const donationId = Number(params?.id); 

  if (!donationId) {
    return NextResponse.json({ error: 'ID da doação inválido' }, { status: 400 });
  }

  try {
    const updated = await prisma.donation.update({
      where: { id: donationId },
      data: {
        status: 'confirmed',
        confirmedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('Erro ao confirmar doação:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
