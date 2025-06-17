import HomePage from "./pages/HomePage";
import styles from './globals.css'
import logger from "./logger";

async function fetchDoacoes() {
  try {
    
    const posts = await db.post.findMany({
      include: {
        author: true
      }
    }) 

    return {data: posts}

  } catch (error) {
    logger.error('Falha ao obter posts do Banco', {error})
    return {data:[]}
  }
}

export default async function Home() {
  const doacoes = await fetchDoacoes();

  return (
    <main className={styles.main}>
      <HomePage />   
    </main>
  );
}