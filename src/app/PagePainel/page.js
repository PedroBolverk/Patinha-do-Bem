'use client';

import { useState, useEffect, useMemo } from 'react';
import { Form, Carousel, CarouselItem } from 'react-bootstrap';
import styles from './style.module.css';
import EventoCard from '../components/Eventos/CardEventos';
import CardDoacao from '../components/CardDoacoes';
import CardLinhaPainel from '../components/Painel/CardTabela';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Painel() {
  const [mostrar, setMostrar] = useState('eventos');
  const [index, setIndex] = useState(0);
  const [eventos, setEventos] = useState([]);
  const [doacoes, setDoacoes] = useState([]);
  const [partici, setParticipacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hook para detectar largura da tela
  function useWindowWidth() {
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    return width;
  }

  const width = useWindowWidth();
  const itemsPerSlide = width < 768 ? 1 : 3;

  // Atualiza o índice quando os dados mudam
  useEffect(() => {
    setIndex(0);
  }, [eventos, doacoes]);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  function groupItems(items, itemsPerSlide) {
    const groupedItems = [];
    for (let i = 0; i < items.length; i += itemsPerSlide) {
      groupedItems.push(items.slice(i, i + itemsPerSlide));
    }
    return groupedItems;
  }

  const eventoGrupos = useMemo(() => groupItems(eventos, itemsPerSlide), [eventos, itemsPerSlide]);
  const doacaoGrupos = useMemo(() => groupItems(doacoes, itemsPerSlide), [doacoes, itemsPerSlide]);

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
    if (mostrar === 'eventos' || mostrar === 'doacoes') {
      return (
        <>
          <Form>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label>{mostrar === 'eventos' ? 'Pesquise seu Evento' : 'Pesquise sua Doação'}</Form.Label>
              <Form.Control type="text" placeholder="Digite sua pesquisa" />
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

      {mostrar === 'eventos' && eventoGrupos.length > 0 && (
        <div className={styles.carouselWrapper}>
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          controls={false}
          indicators
          variant="dark"
          slide
        >
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
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          controls={false}
          indicators
          variant="dark"
          slide
        >
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
