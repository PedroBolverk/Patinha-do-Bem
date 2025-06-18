'use client';
import { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Col } from 'react-bootstrap';
import Image from 'next/image';
import styles from '@/app/Modals/Modal.module.css';
import Login from '@/app/components/Header/Login.png';

export default function RegisterModal({ show, handleClose, openLogin }) {
  const inputFileRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [celular, setCelular] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'COMUM',
    estado: '',
    cidade: '',
    whatsapp: '',
    pix: '',
  });

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => res.json())
      .then(data => setStates(data))
      .catch(err => console.error('Erro ao carregar estados:', err));
  }, []);
  useEffect(() => {
    if (selectedState) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`)
        .then(res => res.json())
        .then(data => setCities(data))
        .catch(err => console.error('Erro ao carregar estados:', err));
    }
  }, [selectedState]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleStateChange = (e) => {
    const uf = e.target.value;
    setSelectedState(uf);
    setFormData(prev => ({ ...prev, estado: uf, cidade: '' }));
    setSelectedCity('');
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setFormData(prev => ({ ...prev, cidade: city }));
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
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'O nome é obrigatório.';
    if (!formData.email.trim()) newErrors.email = 'O e-mail é obrigatório.';
    if (!formData.password.trim()) newErrors.password = 'A senha é obrigatória.';
    if (formData.role === 'ORGANIZADOR' && !formData.pix.trim()) newErrors.pix = 'O Pix é Obrigatório';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'O número de Whatsapp é Obrigatório';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
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
          <Form.Label>Tipo de Usuário</Form.Label>
          <Form.Select
            aria-label="Default select example"
            name='role'
            value={formData.role}
            onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
          >
            <option value='COMUM'>Comum</option>
            <option value='ORGANIZADOR'>Organizador</option>
          </Form.Select>
          <Form.Group>
            <Form.Label>Nome Completo</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              isInvalid={!!errors.name}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
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
              isInvalid={!!errors.email}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
            <Form.Group className="mt-2">
              <Form.Label>Whatsapp</Form.Label>
              <Form.Control
                type="text"
                placeholder="(99) 99999-9999"
                name="whatsapp"
                value={celular}
                isInvalid={!!errors.whatsapp}
                onChange={(e) => {
                  let input = e.target.value.replace(/\D/g, '');
                  if (input.length > 11) input = input.slice(0, 11);
                  const formatted = input
                    .replace(/^(\d{2})(\d)/, '($1) $2')
                    .replace(/(\d{5})(\d)/, '$1-$2');

                  setCelular(formatted);
                  setFormData((prev) => ({ ...prev, whatsapp: formatted }));
                }}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.whatsapp}
              </Form.Control.Feedback>
            </Form.Group>
            {formData?.role === 'ORGANIZADOR' && (
              <Form.Group className="mt-2">
                <Form.Label>Chave Pix</Form.Label>
                <Form.Control
                  type="pix"
                  name="pix"
                  value={formData.pix}
                  isInvalid={!!errors.pix}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.pix}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            <Col>
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={selectedState}
                onChange={handleStateChange}
              >
                <option value="">Selecione o Estado</option>
                {states.map((state) => (
                  <option key={state.id} value={state.sigla}>{state.nome}</option>
                ))}
              </Form.Select>
            </Col>
            <Form.Label>Cidade</Form.Label>
            <Form.Select
              value={selectedCity}
              onChange={handleCityChange}
            >
              <option value="">Selecione a cidade</option>
              {cities.map((city) => (
                <option key={city.id} value={city.nome}>{city.nome}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              isInvalid={!!errors.password}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
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
