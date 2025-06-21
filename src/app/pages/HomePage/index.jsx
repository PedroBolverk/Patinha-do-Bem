'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Shepherd from 'shepherd.js';
import icones from './icones.jpg';
import calendarioevents from './calendarioevents.jpg';
import './style.css';
import '@/app/components/sheperd-custom.css'

export default function HomePage() {
  const [calendario, setCalendario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const botaoDoarRef = useRef(null);
  const eventosRef = useRef(null);
  const adocaoRef = useRef(null);
  const pathname = usePathname();

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

  useEffect(() => {
    function startHomeTour() {
      if (window.tourAtual?.isActive()) return;

      if (!botaoDoarRef.current || !eventosRef.current) {
        setTimeout(startHomeTour, 100);
        return;
      }

      const tour = new Shepherd.Tour({
        defaultStepOptions: {
          scrollTo: true,
          cancelIcon: { enabled: true },
          classes: 'shepherd-theme-custom',
        },
      });

      tour.addStep({
        title: 'Bem-vindo!',
        text: 'Este é um tour da Home Page.',
        buttons: [{ text: 'Próximo', action: tour.next }],
      });

      tour.addStep({
        title: 'Botão de Doação',
        text: 'Clique aqui para doar e apoiar causas importantes.',
        attachTo: { element: botaoDoarRef.current, on: 'bottom' },
        buttons: [{ text: 'Próximo', action: tour.next }],
      });

      tour.addStep({
        title: 'Próximos Eventos',
        text: 'Veja os eventos em destaque e participe!',
        attachTo: { element: eventosRef.current, on: 'bottom' },
        buttons: [{
          text: 'Finalizar',
          action: () => {
            tour.complete();
            localStorage.setItem('home_tour_finalizado', 'true');
            window.tourAtual = null;
          },
        }],
      });

      tour.on('cancel', () => {
        localStorage.setItem('home_tour_finalizado', 'true');
        window.tourAtual = null;
      });

      tour.on('complete', () => {
        window.tourAtual = null;
      });

      tour.start();
      window.tourAtual = tour;
    }

    if (pathname === '/') {
      window.iniciarTour = startHomeTour;

      if (!localStorage.getItem('home_tour_finalizado')) {
        startHomeTour();
      }
    }

    return () => {
      if (window.tourAtual?.isActive()) {
        window.tourAtual.cancel();
        window.tourAtual = null;
      }
      window.iniciarTour = undefined;
    };
  }, [pathname]);



  return (
    <div className="page-wrapper">
      <section className="HeroCardUnified">
        <div className="HeroContentEsquerda">
          <h1 className="Titulo">Ajude-nos a <br /> salvar <br /> os Animais</h1>
          <h2 className="Subtitulo">
            Junte-se a nós e faça a diferença <br /> na vida de animais necessitados
          </h2>

          <Link href="/PageDoacoes" className="BotaoDoar" ref={botaoDoarRef}>
            Doar Agora
          </Link>


        </div>
      </section>

   
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
              <Link className='Link' href="/PageEventos" ref={eventosRef}>Ver Todos</Link>
            </button></div>

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
