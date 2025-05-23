'use client'
import Image from "next/image";
import './style.css';
import icones from "./icones.jpg";
import calendarioevents from "./calendarioevents.jpg";
import { useEffect, useState } from 'react';
import Link from "next/link";

export const CardsEvents = () => {
  const [calendario, setCalendario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/eventos')
      .then(response => {
        if (!response.ok) throw new Error('Erro na resposta da API');
        return response.json();
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

  if (loading) return <div>Carregando eventos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="Container">
      {calendario.length === 0 ? (
        <p>Nenhum evento encontrado.</p>
      ) : (
        <div className="ContentGrupo">
          <h1 className="gabarito Eventos">Próximos Eventos</h1>
          {calendario.map(evento => (
            <div key={evento.id} className="ContentEventos">
              <Image src={calendarioevents} width={32} height={36} alt="Ícone calendário" />
              <div className="TituloEvento">
                {new Date(evento.dataIni).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}<br />
                {evento.titulo}
              </div>

              {/* Imagem do evento, se existir */}
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
          <Link href="/PageEventos">Ver Todos</Link>
        </div>
      )}

      <div className="Missao">
        <h1 className="Eventos">Nossa Missão</h1>
        <h2>Nós nos dedicamos a resgatar, reabilitar e realocar animais, ao mesmo tempo em que educamos a comunidade sobre o tratamento humano de todos os animais.</h2>
      </div>

      <div>
        <h1 className="Adocao">Animais Para <br />Adoção</h1>
        <Image src={icones} alt="Ícones" />
      </div>
    </div>
  );
};
