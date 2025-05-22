import { CardHome } from "./components/CardPost";
import { CardsEvents } from "./components/CardsEventos";
import logger from "./logger";

async function fetchDoacoes() {
  try {
    
    const posts = await db.post.findMany({
      include: {
        author: true
      }
    }) // Buscar dados do Banco //await vai aguardar a resposta do banco

    return {data: posts}

  } catch (error) {
    logger.error('Falha ao obter posts do Banco', {error})
    return {data:[]}
  }
}

export default async function Home() {
  const doacoes = await fetchDoacoes();

  return (
    <main>
      <CardHome />
      <CardsEvents/>     
    </main>
  );
}