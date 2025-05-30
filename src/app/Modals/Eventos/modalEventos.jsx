'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import IconeUpload from '@/app/PageEventos/iconUpload.png';
import styles from './style.module.css';

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
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

  const handleParticipar = () => {
    const isLoggedIn = getCookie('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      alert("Você precisa estar logado para participar de eventos.");
      return;
    }

    setParticipar(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div onClick={onClose} className={styles.overlay}>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalStyle}>
        <button onClick={onClose} className={styles.closeButton}>x</button>

        <div className={styles.contentContainer}>
          {/* Info */}
          <div className={styles.info}>
            <h2 style={{ marginTop: 0 }}>{eventos.titulo}</h2>
            <p><strong>Descrição:</strong> {eventos.descricao}</p>
            <p><strong>Local:</strong> {eventos.local}</p>
            <p><strong>Data:</strong> {new Date(eventos.dataIni).toLocaleDateString('pt-BR')} até {new Date(eventos.dataFim).toLocaleDateString('pt-BR')}</p>

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

          {/* Image */}
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
