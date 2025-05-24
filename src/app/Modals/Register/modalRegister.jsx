'use client';
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function RegisterModal({ show, handleClose, openLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Cadastro realizado com sucesso!');
      handleClose();
      openLogin(); // volta para o modal de login
    } else {
      alert('Erro ao cadastrar. Verifique os dados.');
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
        </Form>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p>Já tem uma conta?{' '}
            <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => {
              handleClose();
              openLogin();
            }}>
              Fazer login
            </span>
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleRegister}>Cadastrar</Button>
      </Modal.Footer>
    </Modal>
  );
}
