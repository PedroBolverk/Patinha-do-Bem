'use client'
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Form, InputGroup, Button } from 'react-bootstrap';
import Image from 'next/image';
import styles from './form.module.css';
import IconeUpload from '@/app/PageEventos/iconUpload.png';

export default function CadastrarDoacaoPage() {
  const router = useRouter();
  const inputFileRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    meta: '',
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
    form.append('titulo', formData.titulo);
    form.append('descricao', formData.descricao);
    form.append('meta', formData.meta);

    if (imageFile) {
      form.append('imagem', imageFile);
      console.log('Imagem enviada:', imageFile);
    }

    const res = await fetch('/api/doacoes', {
      method: 'POST',
      body: form,
      credentials: 'include', // ✅ necessário para enviar cookies da sessão
    });

    if (res.ok) {
      alert('Doação cadastrada com sucesso!');
      router.push('/PageDoacoes');
    } else {
      const erro = await res.json();
      console.error('Erro ao cadastrar a doação:', erro);
      alert('Erro ao cadastrar a doação: ' + (erro?.error || 'desconhecido'));
    }
  }



  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.leftColumn}>
        <InputGroup className="mb-3">
          <InputGroup.Text>Título</InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Título da Doação"
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
            placeholder="Descrição do Evento"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text>Meta</InputGroup.Text>
          <Form.Control
            type="number"
            placeholder="Meta de doação"
            name="meta"
            value={formData.meta}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <Button type="submit" variant="primary">
          Cadastrar Doação
        </Button>
      </div>
      {/* Coluna direita: upload da imagem */}
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
