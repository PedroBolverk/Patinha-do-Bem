'use client';

import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { signIn } from 'next-auth/react';

export default function LoginModal({ show, handleClose, openRegister, onLoginSuccess }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    const result = await signIn('credentials', {
      redirect: false,
      email: credentials.email,
      password: credentials.password,
    });

    if (result?.ok) {
      // Chamada opcional para callback personalizado
      if (onLoginSuccess) onLoginSuccess();

      // ✅ Força atualização da página para garantir que sessão funcione no server
      window.location.reload();
    } else {
      alert('Email ou senha inválidos');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Digite seu email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Senha"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p>
            Não tem uma conta?{' '}
            <span
              style={{ cursor: 'pointer', color: 'blue' }}
              onClick={() => {
                handleClose();
                openRegister();
              }}
            >
              Cadastre-se
            </span>
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleLogin}>Entrar</Button>
      </Modal.Footer>
    </Modal>
  );
}
