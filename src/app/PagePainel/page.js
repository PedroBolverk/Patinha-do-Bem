'use client';

import { useState, useEffect } from 'react';
import { Form, Table } from 'react-bootstrap';
import styles from './style.module.css';
import EventoCard from '../components/Eventos/CardEventos';
import CardDoacao from '../components/CardDoacoes';

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
              {partici.map((p) => (
                <tr key={p.id}>
                  <td>Free</td>
                  <td>{p.evento?.titulo || 'Evento não encontrado'}</td>
                  <td>
                    {p.evento?.dataIni
                      ? `${new Date(p.evento.dataIni).toLocaleDateString('pt-BR')} até ${new Date(p.evento.dataFim).toLocaleDateString('pt-BR')}`
                      : 'Data não disponível'}
                  </td>
                  <td>{p.evento?.local || 'Local não informado'}</td>
                  <td>{p.nome}</td>
                  <td>{p.email}</td>
                  <td>Confirmado</td>
                  <td>{new Date(p.dataHora).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      );
    }

    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descrição</th>
            <th>Meta</th>
            <th>Atual</th>
            <th>Autor</th>
            <th>Email</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {doacoes.map((d) => (
            <tr key={d.id}>
              <td>{d.titulo}</td>
              <td>{d.descricao}</td>
              <td>{d.meta}</td>
              <td>{d.atual}</td>
              <td>{d.author?.name || 'Anônimo'}</td>
              <td>{d.author?.email || 'Não informado'}</td>
              <td>{new Date(d.createdAt).toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div>
      <div className={styles.buttonHeader}>
        <button
          className={styles.botaoEventosDoacoes}
          onClick={() => setMostrar('eventos')}
        >
          Eventos
        </button>
        <button
          className={styles.botaoEventosDoacoes}
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
