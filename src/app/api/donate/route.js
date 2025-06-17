import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generatePixPayload } from '@/utils/pix';
import { formatCurrency } from '@/utils/format';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, postId, donorName, donorEmail } = body;

    // ✅ Validação obrigatória
    if (!amount || !postId || isNaN(amount) || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Valor ou campanha inválidos' }, { status: 400 });
    }

    // 🔎 Busca a campanha e o autor com chave Pix
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true }
    });

    if (!post || !post.author?.pix) {
      return NextResponse.json({ error: 'Campanha ou chave Pix não encontrada' }, { status: 400 });
    }

    const valorNumerico = parseFloat(Number(amount).toFixed(2));

    // 🧼 Nome do recebedor (sem acentos, em caixa alta)
    const sanitizedName = post.author.name
      ?.toUpperCase()
      .substring(0, 25)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // 🏷️ Descrição do pagamento Pix
    const descricaoPix = `Doação ${post.titulo}`.substring(0, 30);

    // 🧾 Gera payload Pix válido
    const payload = generatePixPayload({
      pixKey: post.author.pix,
      amount: valorNumerico,
      merchantName: sanitizedName,
    });

    // 💾 Salva a doação no banco
    const donation = await prisma.donation.create({
      data: {
        amount: valorNumerico,
        donorName,
        donorEmail,
        status: 'pending',
        postId: post.id,
        receiverId: post.author.id
      }
    });

    // 📲 Geração do link de confirmação via WhatsApp
    const phone = post.author.whatsapp?.replace(/\D/g, '') || '';
    const valorFormatado = formatCurrency(valorNumerico);
    const confirmUrl = `https://seusite.com/confirmar-doacao/${donation.id}`;
    const msg = `Olá! Fiz uma doação de ${valorFormatado} para sua campanha "${post.titulo}". Pode confirmar o recebimento aqui: ${confirmUrl}`;
    const whatsappLink = `https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`;

    return NextResponse.json({
      success: true,
      payload,
      whatsappLink,
      donationId: donation.id
    });

  } catch (error) {
    console.error('Erro ao processar doação:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
