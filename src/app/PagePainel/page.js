'use client';

import { useState, useEffect } from 'react';
import { Form, Table } from 'react-bootstrap';
import styles from './style.module.css';
import EventoCard from '../components/Eventos/CardEventos';

export default function Painel() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partici, setParticipacoes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setEventos([]);
      setParticipacoes([]);
      setLoading(false);
      return;
    }

    // 🔹 Fetch dos eventos do organizador
    fetch(`/api/eventos?userId=${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar eventos');
        return res.json();
      })
      .then(data => {
        setEventos(data); // ← eventos que ele criou
      })
      .catch(err => {
        console.error('Erro ao carregar eventos', err);
      });

    // 🔹 Fetch das participações
    fetch('/api/participacoes')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar participações');
        return res.json();
      })
      .then(data => {
        setParticipacoes(data); // ← participações (tabela)
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);


  if (loading) return <div>Carregando eventos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className={styles.buttonHeader}>
        <button className={styles.botaoEventosDoacoes}>Eventos</button>
        <button className={styles.botaoEventosDoacoes}>Doações</button>
      </div>

      <h1>Painel Eventos</h1>

      {eventos.length === 0 ? (
        <p>Nenhum evento encontrado.</p>
      ) : (
        <div className={styles.grid}>
          {eventos.map((evento) => (
            <EventoCard key={evento.id} evento={evento} />
          ))}
        </div>
      )}

      {/* Resto do formulário e tabela */}
      <Form>
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>Pesquise seu Evento</Form.Label>
          <Form.Control type="text" placeholder="Digite seu Evento" />
        </Form.Group>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Valor</th>
            <th>Evento</th>
            <th>Data do Evento</th>
            <th>Local</th>
            <th>Participante</th>
            <th>Email</th>
            <th>Status</th>
            <th>Data da Confirmação</th>
          </tr>
        </thead>
        <tbody>
          {partici.map((participacao) => (
            <tr key={participacao.id}>
              <td>Free</td>
              <td>{participacao.evento?.titulo || 'Evento não encontrado'}</td>
              <td>
                {participacao.evento?.dataIni
                  ? `${new Date(participacao.evento.dataIni).toLocaleDateString('pt-BR')} até ${new Date(participacao.evento.dataFim).toLocaleDateString('pt-BR')}`
                  : 'Data não disponível'}
              </td>
              <td>{participacao.evento?.local || 'Local não informado'}</td>
              <td>{participacao.nome}</td>
              <td>{participacao.email}</td>
              <td>Confirmado</td>
              <td>{new Date(participacao.dataHora).toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
