'use client'
import { useEffect, useState } from 'react';
import styles from '@/app/PageEventos/style.module.css'
import CardDoacao from '@/app/components/CardDoacoes/index';
import CadastrarDoacao from '../components/ButtonCadastroDoacao/buttonCadastrarDoacao';
import ModalDoacoes from '../Modals/Doacoes/modalDoacoes';

export default function DoacoesPage() {
  
  const [doacoes, setDoacoes] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    function handleRoleChange() {
      const storedUserRole = localStorage.getItem('userRole');
      setUserRole(storedUserRole);
    }
    window.addEventListener('userRoleChanged', handleRoleChange);

    handleRoleChange();
    fetch('/api/doacoes') 
      .then((res) => {
        if (!res.ok) throw new Error('Erro na resposta da API');
        return res.json();
      })
      .then((data) => {
        setDoacoes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar doações', err);
        setError('Erro ao carregar dados. Tente novamente.');
        setLoading(false);
      })
      
      
    return () => {
      window.removeEventListener('userRoleChanged', handleRoleChange);
    };
  }, []);
  if (loading) {
    return <div>Carregando doações...</div>
  }
  if (error) {
    return <div>{error}</div>
  }

  return (
    <main className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.titulo}>Doações em Andamento</h1>
        {userRole == 'ORGANIZADOR' && (
          <CadastrarDoacao />
        )}
      </div>


      <div className={styles.grid}>
        {doacoes.length === 0 ? (
          <p>Nenhuma doação encontrada.</p>
        ) : (
          doacoes.map((post) => (
            <div key={post.id} onClick={() => setSelecionada(post)}>
              <CardDoacao doacao={post} />
            </div>
          ))
        )}
      </div>

      <ModalDoacoes doacao={selecionada} onClose={() => setSelecionada(null)} />
    </main>
  );
}
