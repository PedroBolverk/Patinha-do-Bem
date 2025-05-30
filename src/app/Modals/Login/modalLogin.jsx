'use client';
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function LoginModal({ show, handleClose, openRegister, onLoginSuccess }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (res.ok) {
        const data = await res.json();

        // Cookies — Proteção de rota via middleware
        document.cookie = 'isLoggedIn=true; path=/'; // ✅ Aqui é o ponto chave

        // localStorage — Dados visuais
        if (data.name) {
          localStorage.setItem('username', data.name);
        }
        if (data.image) {
          localStorage.setItem('userImage', encodeURI(data.image));
        }
        if (data.id) {
          localStorage.setItem('userId', data.id.toString());
        }
        if (data.role) {
          localStorage.setItem('userRole', data.role);
        }

        if (onLoginSuccess) onLoginSuccess();

        alert('Login realizado com sucesso');
        handleClose();
      } else {
        const error = await res.json();
        alert(error.error || 'Credenciais inválidas');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      alert('Erro ao realizar login');
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
