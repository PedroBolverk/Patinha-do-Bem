'use client'
import { useEffect, useState } from 'react';
import styles from '@/app/components/CardDoacoes/style.module.css';
import CardDoacao from '@/app/components/CardDoacoes/index';
import CadastrarDoacao from '../components/ButtonCadastroDoacao';
import Modal from '../components/modal';

export default function DoacoesPage() {
  //pegar doações qualquer
  const [doacoes, setDoacoes] = useState([]);
  //pegar seleção, estado inicial quando nao tem nada selecionado
  const [selecionada, setSelecionada] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Chamada da API ao carregar a tela
  useEffect(() => {
    fetch('/api/doacoes') //buscar doações
      .then((res) => {
        if (!res.ok) throw new Error('Erro na resposta da API');//se nao carregar 
        return res.json(); 
      })
      .then((data) =>{
        setDoacoes(data);
        setLoading(false);
      })
      .catch((err) =>{
        console.error('Erro ao buscar doações', err);
        setError('Erro ao carregar dados. Tente novamente.');
        setLoading(false);
      });      
  }, []);
        if (loading){
          return <div>Carregando doações...</div>
        }
        if (error){
          return <div>{error}</div>
        }

  return (
    <main className={styles.containerMain}>
      <div className={styles.header}>
        <h1 className={styles.titulo}>Doações em Andamento</h1>
        <CadastrarDoacao />
      </div>

      
      <div className={styles.container}>
        {doacoes.length === 0 ? (
          <p>Nenhuma doação encontrada.</p>
        ) : (
          doacoes.map((doacao) => (
            <div key={doacao.id} onClick={() => setSelecionada(doacao)}>
              <CardDoacao doacao={doacao} />
            </div>
          ))
        )}
      </div>

      <Modal doacao={selecionada} onClose={() => setSelecionada(null)} />
    </main>
  );
}
