'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import IconeUpload from '@/app/PageEventos/iconUpload.png';
import styles from './style.module.css'

export default function ModalEventos({ eventos, onClose }) {
  const inputFileRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log("Evento selecionado:", eventos);
    setSelectedImage(null); // limpa imagem anterior ao abrir novo modal
  }, [eventos]);

  if (!eventos) return null;

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

            <button className={styles.button}>Participar</button>
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

