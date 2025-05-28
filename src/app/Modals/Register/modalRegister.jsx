'use client';
import { useState, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Image from 'next/image';
import styles from '@/app/Modals/Modal.module.css';
import Login from '@/app/components/Header/Login.png';

export default function RegisterModal({ show, handleClose, openLogin }) {
  const inputFileRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async () => {
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      if (imageFile) {
        form.append('imagem', imageFile);
      }

      const res = await fetch('/api/register', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        const data = await res.json();

        if (data.imageUrl) {
     
          localStorage.setItem('userImage', encodeURI(data.imageUrl));
        }

        localStorage.setItem('username', formData.name);
        alert('Cadastro realizado com sucesso!');
        handleClose();
        openLogin();
      } else {
        const errData = await res.json();
        alert(`Erro ao cadastrar: ${errData.error || 'verifique os dados.'}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro inesperado ao cadastrar.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cadastro</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Usuário</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

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
                  <Image
                    src={Login}
                    className={styles.icone}
                    alt="Upload ícone"
                    width={80}
                    height={80}
                  />
                  <p style={{ marginTop: '1rem' }}>Clique para enviar imagem</p>
                </>
              )}
            </div>
          </div>
        </Form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p>
            Já tem uma conta?{' '}
            <span
              style={{ cursor: 'pointer', color: 'blue' }}
              onClick={() => {
                handleClose();
                openLogin();
              }}
            >
              Fazer login
            </span>
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleRegister}>
          Cadastrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
