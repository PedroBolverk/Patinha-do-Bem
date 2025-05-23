'use client'

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import IconeUpload from '@/app/PageEventos/iconUpload.png' // ajuste conforme seu projeto

export default function CadastrarEventoPage() {
  const router = useRouter();
  const inputFileRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    dataIni: '',
    dataFim: '',
    local: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleImageClick() {
    inputFileRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const form = new FormData();
    form.append('titulo', formData.titulo);
    form.append('descricao', formData.descricao);
    form.append('dataIni', formData.dataIni);
    form.append('dataFim', formData.dataFim);
    form.append('local', formData.local);
    if (imageFile) {
      form.append('imagem', imageFile);
    }

    const res = await fetch('/api/eventos', {
      method: 'POST',
      body: form, // FormData automaticamente define o header
    });

    if (res.ok) {
      alert('Evento cadastrado com sucesso!');
      router.push('/');
    } else {
      alert('Erro ao cadastrar o evento');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="titulo"
        placeholder="Título do Evento"
        value={formData.titulo}
        onChange={handleChange}
        required
      />
      <textarea
        name="descricao"
        placeholder="Descrição"
        value={formData.descricao}
        onChange={handleChange}
        required
      />
      <input
        name="dataIni"
        type="date"
        value={formData.dataIni}
        onChange={handleChange}
        required
      />
      <input
        name="dataFim"
        type="date"
        value={formData.dataFim}
        onChange={handleChange}
        required
      />
      <input
        name="local"
        placeholder="Local do Evento"
        value={formData.local}
        onChange={handleChange}
        required
      />

      {/* Upload da imagem */}
      <input
        type="file"
        accept="image/*"
        hidden
        ref={inputFileRef}
        onChange={handleFileChange}
      />
      <div onClick={handleImageClick} style={{ cursor: 'pointer', marginTop: '1rem' }}>
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Imagem selecionada"
            style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain' }}
          />
        ) : (
          <>
            <Image src={IconeUpload} alt="Upload ícone" width={50} height={50} />
            <p>Clique aqui para enviar uma imagem</p>
          </>
        )}
      </div>

      <button type="submit">Cadastrar Evento</button>
    </form>
  );
}
