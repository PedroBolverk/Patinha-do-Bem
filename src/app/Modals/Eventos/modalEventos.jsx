'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import IconeUpload from '@/app/PageEventos/iconUpload.png';
import styles from './style.module.css';

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return value;
  }
  return null;
}


export default function ModalEventos({ eventos, onClose }) {
  const inputFileRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [participar, setParticipar] = useState(false);

  useEffect(() => {
    setSelectedImage(null);
    setParticipar(false);
  }, [eventos]);

  if (!eventos) return null;

  const handleParticipar = async () => {
    const isLoggedIn = getCookie('isLoggedIn') === 'true';
    const nome = localStorage.getItem('username');
    const email = localStorage.getItem('userEmail'); // ← garante que o e-mail é capturado
console.log({ isLoggedIn, nome, email }); 
    if (!isLoggedIn || !nome || !email) {
      alert("Você precisa estar logado para participar de eventos.");
      return;
    }

    try {
      const res = await fetch('/api/participacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventoId: eventos.id,
          nome,
          email,
        }),
      });

      if (!res.ok) throw new Error('Erro ao registrar participação');

      setParticipar(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      alert('Não foi possível registrar sua participação.');
    }
  };

  return (
    <div onClick={onClose} className={styles.overlay}>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalStyle}>
        <button onClick={onClose} className={styles.closeButton}>x</button>

        <div className={styles.contentContainer}>
          <div className={styles.info}>
            <h2 style={{ marginTop: 0 }}>{eventos.titulo}</h2>
            <p><strong>Descrição:</strong> {eventos.descricao}</p>
            <p><strong>Local:</strong> {eventos.local}</p>
            <p>
              <strong>Data:</strong>{' '}
              {new Date(eventos.dataIni).toLocaleDateString('pt-BR')} até{' '}
              {new Date(eventos.dataFim).toLocaleDateString('pt-BR')}
            </p>

            <button
              className={`${styles.button} ${participar ? styles.confirmado : ''}`}
              onClick={handleParticipar}
              disabled={participar}
            >
              {participar ? (
                <span className={styles.confirmadoContent}>
                  <span className={styles.checkIcon}>✔</span> Confirmado
                </span>
              ) : (
                'Participar'
              )}
            </button>
          </div>

          <div className={styles.imageContainer}>
            <Image
              src={eventos.imagem || IconeUpload}
              alt={`Imagem do evento ${eventos.titulo}`}
              width={300}
              height={300}
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
