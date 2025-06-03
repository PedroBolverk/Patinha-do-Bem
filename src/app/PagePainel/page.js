'use client';

import { useState, useEffect } from 'react';
import { Form, Table } from 'react-bootstrap';
import styles from './style.module.css';
import EventoCard from '../components/Eventos/CardEventos';
import CardDoacao from '../components/CardDoacoes';
import CardLinhaPainel from '../components/Painel/CardTabela';

export default function Painel() {
  const [mostrar, setMostrar] = useState('eventos');
  const [eventos, setEventos] = useState([]);
  const [doacoes, setDoacoes] = useState([]);
  const [partici, setParticipacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setEventos([]);
      setParticipacoes([]);
      setDoacoes([]);
      setLoading(false);
      return;
    }

    fetch(`/api/eventos?userId=${userId}`)
      .then(res => res.json())
      .then(setEventos)
      .catch(console.error);

    fetch(`/api/participacoes?userId=${userId}`)
      .then(res => res.json())
      .then(setParticipacoes)
      .catch(console.error);

    fetch(`/api/doacoes?userId=${userId}`)
      .then(res => res.json())
      .then(setDoacoes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Carregando dados...</div>;
  if (error) return <div>{error}</div>;

  const renderTabela = () => {
    if (mostrar === 'eventos') {
      return (
        <>
          <Form>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label>Pesquise seu Evento</Form.Label>
              <Form.Control type="text" placeholder="Digite seu Evento" />
            </Form.Group>
          </Form>

          {partici.map((p) => (
  <CardLinhaPainel
    key={p.id}
    valor={0}
    titulo={p.evento?.titulo}
    nome={p.nome}
    email={p.email}
    data={p.dataHora}
    status="confirmado"
  />
))}

        </>
      );
    }

    return (
      <>
      {doacoes.map((d) => (
  <CardLinhaPainel
    key={d.id}
    valor={d.meta}
    titulo={d.titulo}
    nome={d.author?.name || 'Anônimo'}
    email={d.author?.email || '---'}
    data={d.createdAt}
    status="confirmado"
  />
))}
</>
    );
  };

  return (
    <div className="container">
      <div className={styles.buttonHeader}>
         <button
    className={`${styles.botaoEventosDoacoes} ${mostrar === 'eventos' ? styles.botaoAtivo : ''}`}
    onClick={() => setMostrar('eventos')}
  >
    Eventos
  </button>
       <button
    className={`${styles.botaoEventosDoacoes} ${mostrar === 'doacoes' ? styles.botaoAtivo : ''}`}
    onClick={() => setMostrar('doacoes')}
  >
    Doações
  </button>
      </div>

      <h1>{mostrar === 'eventos' ? 'Painel de Eventos' : 'Painel de Doações'}</h1>

      {mostrar === 'eventos' && eventos.length > 0 && (
        <div className={styles.grid}>
          {eventos.map((evento) => (
            <EventoCard key={evento.id} evento={evento} />
          ))}
        </div>
      )}

      {mostrar === 'doacoes' && doacoes.length > 0 && (
        <div className={styles.grid}>
          {doacoes.map((doacao) => (
            <div key={doacao.id}>
              <CardDoacao doacao={doacao} />
            </div>
          ))}
        </div>
      )}

      {renderTabela()}
    </div>
  );
}
