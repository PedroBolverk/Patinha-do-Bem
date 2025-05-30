'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./style.module.css";
import CadastrarEvento from "../components/ButtonCadastroEvento/buttonCadastrarEvento";
import ModalEventos from "../Modals/Eventos/modalEventos";
import EventoCard from "../components/Eventos/CardEventos";


export default function EventosPage() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selecionada, setSelecionada] = useState(null);
  const [userRole, setUserRole] = useState(null);


  useEffect(() => {
  function handleRoleChange() {
    const storedUserRole = localStorage.getItem('userRole');
    setUserRole(storedUserRole);
  }
  
  window.addEventListener('userRoleChanged', handleRoleChange);

  handleRoleChange();

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

  return () => {
    window.removeEventListener('userRoleChanged', handleRoleChange);
  };
}, []);


  if (loading) return <div>Carregando Eventos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Eventos</h1>
        {userRole === 'ORGANIZADOR' && (
          <CadastrarEvento />
        )}

      </div>

      {eventos.length === 0 ? (
        <p>Nenhum evento encontrado.</p>
      ) : (
        <div className={styles.grid}>
          {eventos.map((evento) => (
           <EventoCard key={evento.id} evento={evento} onSelect={setSelecionada}/>
          ))}
        </div>
      )}

      {selecionada && (
        <ModalEventos eventos={selecionada} onClose={() => setSelecionada(null)} />
      )}
    </div>
  );
}
