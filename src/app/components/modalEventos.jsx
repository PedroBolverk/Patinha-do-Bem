'use client';

import { useRef, useState } from 'react';
import Image from 'next/image'; // necessário se você estiver usando o componente <Image />
import IconeUpload from '@/app/PageEventos/iconUpload.png' // atualize o caminho conforme necessário

export default function ModalEventos({ eventos, onClose }) {
  const inputFileRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  if (!eventos) return null;

  const handleImageClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div onClick={onClose} style={overlayStyle}>
      <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
        <button onClick={onClose} style={closeButtonStyle}>×</button>

        <input
          type="file"
          id="file"
          accept="image/*"
          hidden
          ref={inputFileRef}
          onChange={handleFileChange}
        />

        <div onClick={handleImageClick} style={{ cursor: "pointer", marginBottom: '1rem' }}>
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Preview da imagem"
              style={{ maxWidth: "150px", maxHeight: "150px", objectFit: "contain" }}
            />
          ) : (
            <>
              <Image src={IconeUpload} alt="Ícone Upload" width={50} height={50} />
              <h3>Upload Image</h3>
            </>
          )}
        </div>

        {/* Você pode colocar um botão de envio ou outro conteúdo aqui */}
        <button onClick={() => alert("Imagem pronta para envio!")}>Enviar</button>
      </div>
    </div>
  );
}

// Estilos básicos (você pode substituir por CSS modules se preferir)
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
  borderRadius: '8px',
  position: 'relative',
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
