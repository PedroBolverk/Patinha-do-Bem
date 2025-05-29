'use client';

import { useState, useEffect } from 'react';
import { Form, Table } from 'react-bootstrap';
import styles from './style.module.css';
import EventoCard from '../components/Eventos/CardEventos';

export default function Painel() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setEventos([]);
      setLoading(false);
      return;
    }

    fetch(`/api/eventos?userId=${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar eventos');
        return res.json();
      })
      .then(data => {
        setEventos(data);
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
           <EventoCard key={evento.id} evento={evento}/>
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
            <th>Participante</th>
            <th>Email</th>
            <th>Status</th>
            <th>Data da Confirmação</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Free</td>
            <td>Exames Grátis</td>
            <td>03/05/2025</td>
            <td>Carlos</td>
            <td>teste@email.com.br</td>
            <td>Confirmado</td>
            <td>03/05/2025</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
