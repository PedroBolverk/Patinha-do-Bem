'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import caoegato from './caoegato.png';
import icones from './icones.jpg';
import calendarioevents from './calendarioevents.jpg';
import './style.css';

export default function HomePage() {
  const [calendario, setCalendario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/eventos')
      .then((res) => {
        if (!res.ok) throw new Error('Erro na resposta da API');
        return res.json();
      })
      .then((data) => {
        setCalendario(data.slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar eventos', err);
        setError('Erro ao carregar dados. Tente novamente.');
      });
  }, []);

  return (
    <div className="page-wrapper">
      {/* Hero Card Responsivo */}
      <section className="HeroCardUnified">
        <div className="HeroContentEsquerda">
          <h1 className="Titulo">Ajude-nos a salvar os Animais</h1>
          <h2 className="Subtitulo">
            Junte-se a nós e faça a diferença na vida de animais necessitados
          </h2>
          <button className='TodosEventos'>
          <Link className='Link' href="/PageDoacoes">Doar Agora</Link>
        </button>
        </div>
        <div className="HeroImageDireita">
          <Image src={caoegato} alt="Cão e Gato" className="HeroImageContent" />
        </div>
      </section>

      {/* Cards de Eventos, Missão e Adoção */}
      <section className="Container">
         <div className="EventosMissaoContainer">
        <div className="ContentGrupo">
          <h1 className="gabarito Eventos">Próximos Eventos</h1>

          {loading && <p>Carregando eventos...</p>}
          {error && <p>{error}</p>}

          {calendario.map((evento) => (
            <div key={evento.id} className="ContentEventos">
              <Image src={calendarioevents} width={32} height={36} alt="Ícone calendário" />
              <div className="TituloEvento">
                {new Date(evento.dataIni).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}<br />
                {evento.titulo}
              </div>

              {evento.imagem && (
                <div style={{ marginTop: '10px' }}>
                  <Image
                    src={evento.imagem}
                    alt={`Imagem do evento ${evento.titulo}`}
                    width={150}
                    height={150}
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              )}
            </div>
          ))}
          <button className='TodosEventos'>
          <Link className='Link' href="/PageEventos">Ver Todos</Link>
        </button></div>
        

        {/* Missão + Adoção em bloco separado */}
        <div className="MissaoAdocaoWrapper">
          <div className="Adocao">
            <h1 className="Eventos">Animais Para <br />Adoção</h1>
            <Image src={icones} alt="Ícones" className="AdocaoImg" />
          </div>
          <div className="Missao">
            <h1 className="Eventos">Nossa Missão</h1>
            <h2>
              Nós nos dedicamos a resgatar, reabilitar e realocar animais, ao mesmo tempo em que educamos a comunidade sobre o tratamento humano de todos os animais.
            </h2>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
