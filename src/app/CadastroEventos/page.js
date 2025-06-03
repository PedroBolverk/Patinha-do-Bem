'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Form, InputGroup, Button } from 'react-bootstrap';
import Image from 'next/image';
import styles from './form.module.css';
import IconeUpload from '@/app/PageEventos/iconUpload.png';

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
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      form.append(key, value)
    );
    if (imageFile) {
      form.append('imagem', imageFile);
    }

    const userId = localStorage.getItem('userId');
    const res = await fetch(`/api/eventos?userId=${userId}`, {
      method: 'POST',
      body: form,
    });

    if (res.ok) {
      alert('Evento cadastrado com sucesso!');
      router.push('/PageEventos');
    } else {
      alert('Erro ao cadastrar o evento');
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.leftColumn}>
        <InputGroup className="mb-3">
          <InputGroup.Text>Título</InputGroup.Text>
          <Form.Control
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text>Descrição</InputGroup.Text>
          <Form.Control
            type="text"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text>Data de Início</InputGroup.Text>
          <Form.Control
            type="date"
            name="dataIni"
            value={formData.dataIni}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text>Data de Término</InputGroup.Text>
          <Form.Control
            type="date"
            name="dataFim"
            value={formData.dataFim}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text>Local</InputGroup.Text>
          <Form.Control
            type="text"
            name="local"
            value={formData.local}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <Button type="submit" variant="primary">
          Cadastrar Evento
        </Button>
      </div>

      <div className={styles.rightColumn}>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={inputFileRef}
          onChange={handleFileChange}
        />
        <div onClick={handleImageClick} className={styles.uploadContainer}>
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Imagem selecionada"
              className={styles.imagePreview}
            />
          ) : (
            <>
              <Image src={IconeUpload} className={styles.icone} alt="Upload ícone" width={80} height={80} />
              <p style={{ marginTop: '1rem' }}>Clique para enviar imagem</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
