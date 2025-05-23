'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./style.module.css";
import CadastrarEvento from "../components/ButtonCadastroEvento/buttonCadastrarEvento";
import ModalEventos from "../Modals/Eventos/modalEventos";

export default function EventosPage() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selecionada, setSelecionada] = useState(null);

  useEffect(() => {
    fetch("/api/eventos")
      .then((res) => {
        if (!res.ok) throw new Error("Erro na resposta da API");
        return res.json();
      })
      .then((data) => {
        setEventos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar eventos", err);
        setError("Erro ao carregar dados. Tente novamente.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Carregando Eventos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Eventos</h1>
        <CadastrarEvento />
      </div>

      {eventos.length === 0 ? (
        <p>Nenhum evento encontrado.</p>
      ) : (
        <div className={styles.grid}>
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className={styles.card}
              onClick={() => setSelecionada(evento)}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={evento.imagem || "/default-image.jpg"}
                  alt={`Imagem do evento ${evento.titulo}`}
                  width={300}
                  height={180}
                  className={styles.image}
                />
              </div>
              <div className={styles.body}>
                <h3 className={styles.title}>{evento.titulo}</h3>
                <p className={styles.desc}>{evento.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalEventos eventos={selecionada} onClose={() => setSelecionada(null)} />
    </div>
  );
}
