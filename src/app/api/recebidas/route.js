import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOption";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function GET() {

  const session = await getServerSession({ req: { headers: headers() }, ...authOptions });

  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: 'Usuário não autenticado' }), { status: 401 });
  }

  const doacoes = await prisma.donation.findMany({
    where: {
      receiverId: session.user.id, 
    },
    include: {
      post: true,  
    },
    orderBy: {
      createdAt: 'desc',  
    },
  });

  const eventos = await prisma.events.findMany({
    where: {
      organizadorId: session.user.id, 
    },
    include: {
      organizador: true, 
      participacoes: true, 
    },
    orderBy: {
      dataIni: 'asc', 
    },
  });

  return new Response(
    JSON.stringify({
      doacoes,
      eventos,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
