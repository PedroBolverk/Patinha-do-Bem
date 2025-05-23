'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import IconeUpload from '@/app/PageEventos/iconUpload.png'; // ajuste conforme seu projeto

export default function ModalEventos({ eventos, onClose }) {
  const inputFileRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log("Evento selecionado:", eventos);
    setSelectedImage(null); // limpa imagem anterior ao abrir novo modal
  }, [eventos]);

  if (!eventos) return null;

  return (
    <div onClick={onClose} style={overlayStyle}>
      <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
        <button onClick={onClose} style={closeButtonStyle}>×</button>

        <div style={contentContainer}>
          {/* Lado Esquerdo - Informações */}
          <div style={infoStyle}>
            <h2 style={{ marginTop: 0 }}>{eventos.titulo}</h2>
            <p><strong>Descrição:</strong> {eventos.descricao}</p>
            <p><strong>Local:</strong> {eventos.local}</p>
            <p><strong>Data:</strong> {new Date(eventos.dataIni).toLocaleDateString('pt-BR')} até {new Date(eventos.dataFim).toLocaleDateString('pt-BR')}</p>

            <button style={buttonStyle}>Participar</button>
          </div>

          {/* Lado Direito - Imagem */}
          <div style={imageContainer}>
            <Image
              src={eventos.imagem || IconeUpload}
              alt={`Imagem do evento ${eventos.titulo}`}
              width={300}
              height={300}
              style={{ objectFit: 'cover', borderRadius: '10px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Estilização
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '12px',
  width: '90%',
  maxWidth: '800px',
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  fontSize: '1.5rem',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};

const contentContainer = {
  display: 'flex',
  flexDirection: 'row',
  gap: '2rem',
  alignItems: 'flex-start',
};

const infoStyle = {
  flex: 1,
};

const imageContainer = {
  flexShrink: 0,
};

const buttonStyle = {
  marginTop: '1.5rem',
  padding: '0.6rem 1.2rem',
  backgroundColor: '#00bfa6',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
};
