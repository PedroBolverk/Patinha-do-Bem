'use client';

import { useState, useEffect, useMemo } from 'react';
import { Form, Carousel, CarouselItem } from 'react-bootstrap';
import styles from './style.module.css';
import EventoCard from '../components/Eventos/CardEventos';
import CardDoacao from '../components/CardDoacoes';
import CardLinhaPainel from '../components/Painel/CardTabela';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Painel() {
   const useWindowWidth = () => {
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    return width;
  };
  const [mostrar, setMostrar] = useState('eventos');
  const [index, setIndex] = useState(0);
  const [eventos, setEventos] = useState([]);
  const [doacoes, setDoacoes] = useState([]);
  const [participacoes, setParticipacoes] = useState([]);
  const [doacoesRecebidas, setDoacoesRecebidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const width = useWindowWidth();
  const itemsPerSlide = width < 768 ? 1 : 3;

  useEffect(() => {
    const fetchRecebidas = async () => {
      try {
        const res = await fetch('/api/recebidas');
        if (!res.ok) throw new Error('Erro ao carregar doações recebidas');
        const data = await res.json();
        setDoacoesRecebidas(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecebidas();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setEventos([]);
      setParticipacoes([]);
      setDoacoes([]);
      setLoading(false);
      return;
    }

    async function fetchPainelData() {
      try {
        const [eventosRes, participacoesRes, doacoesRes] = await Promise.all([
          fetch(`/api/eventos?userId=${userId}`),
          fetch(`/api/participacoes?userId=${userId}`),
          fetch(`/api/doacoes?userId=${userId}`),
        ]);

        const [eventosData, participacoesData, doacoesData] = await Promise.all([
          eventosRes.json(),
          participacoesRes.json(),
          doacoesRes.json(),
        ]);

        setEventos(eventosData);
        setParticipacoes(participacoesData);
        setDoacoes(doacoesData);
      } catch (err) {
        console.error('Erro ao buscar dados do painel:', err);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    }

    fetchPainelData();
  }, []);

  const confirmarDoacao = async (id) => {
    try {
      const res = await fetch(`/api/doacoes/${id}/confirm`, { method: 'PATCH' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Erro ao confirmar doação');

      setDoacoesRecebidas((prev) =>
        prev.map((doa) =>
          doa.id === id ? { ...doa, status: 'confirmed', confirmedAt: new Date() } : doa
        )
      );
    } catch (err) {
      console.error('Erro ao confirmar doação:', err);
      alert('Erro ao confirmar a doação');
    }
  };

 

  const handleSelect = (selectedIndex) => setIndex(selectedIndex);

  const groupItems = (items, perSlide) => {
    const grouped = [];
    for (let i = 0; i < items.length; i += perSlide) {
      grouped.push(items.slice(i, i + perSlide));
    }
    return grouped;
  };

  const eventoGrupos = useMemo(() => groupItems(eventos, itemsPerSlide), [eventos, itemsPerSlide]);
  const doacaoGrupos = useMemo(() => groupItems(doacoes, itemsPerSlide), [doacoes, itemsPerSlide]);

  const renderTabela = () => {
    if (mostrar === 'eventos') {
      return (
        <>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Pesquise seu Evento</Form.Label>
              <Form.Control type="text" placeholder="Digite sua pesquisa" />
            </Form.Group>
          </Form>
          {participacoes.map((p) => (
            <CardLinhaPainel
              key={p.id}
              titulo={p.evento?.titulo}
              nome={p.nome}
              whatsapp={p.whatsapp}
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
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Doações Recebidas</Form.Label>
            <Form.Control type="text" placeholder="Digite sua pesquisa" />
          </Form.Group>
        </Form>

        {doacoesRecebidas.map((d) => (
          <CardLinhaPainel
            key={d.id}
            id={d.id}
            valor={d.amount}
            titulo={d.post?.titulo}
            nome={d.donorName || 'Anônimo'}
            email={d.donorEmail || '---'}
            whatsapp={d.whatsapp}
            data={d.createdAt}
            status={d.status}
            onConfirm={confirmarDoacao}
          />
        ))}
      </>
    );
  };

  if (loading) return <div>Carregando dados...</div>;
  if (error) return <div>{error}</div>;

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

      {mostrar === 'eventos' && eventoGrupos.length > 0 && (
        <div className={styles.carouselWrapper}>
          <Carousel activeIndex={index} onSelect={handleSelect} controls={false} indicators variant="dark" slide>
            {eventoGrupos.map((grupo, idx) => (
              <CarouselItem key={idx}>
                <div className={styles.carouselGroup}>
                  {grupo.map((evento) => (
                    <EventoCard key={evento.id} evento={evento} />
                  ))}
                </div>
              </CarouselItem>
            ))}
          </Carousel>
        </div>
      )}

      {mostrar === 'doacoes' && doacaoGrupos.length > 0 && (
        <div className={styles.carouselWrapper}>
          <Carousel activeIndex={index} onSelect={handleSelect} controls={false} indicators variant="dark" slide>
            {doacaoGrupos.map((grupo, idx) => (
              <CarouselItem key={idx}>
                <div className={styles.carouselGroup}>
                  {grupo.map((doacao) => (
                    <CardDoacao key={doacao.id} doacao={doacao} />
                  ))}
                </div>
              </CarouselItem>
            ))}
          </Carousel>
        </div>
      )}

      {renderTabela()}
    </div>
  );
}
