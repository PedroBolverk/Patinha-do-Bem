'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import IconeUpload from '@/app/PageEventos/iconUpload.png';
import styles from './style.module.css';

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return value;
  }
  return null;
}

export default function ModalEventos({ eventos, onClose }) {
  const inputFileRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [participar, setParticipar] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setSelectedImage(null);
    setParticipar(false);
    setErrors({});
  }, [eventos]);

  if (!eventos) return null;

  const handleParticipar = async () => {
    const newErrors = {};
    //const isLoggedIn = getCookie('isLoggedIn') === 'true';

    const nomeLS = localStorage.getItem('username');
    const emailLS = localStorage.getItem('userEmail');

    const nomeFinal = nome.trim();

    const emailFinal = email.trim() || emailLS || '';

    //if (!isLoggedIn) {
   //   alert("Você precisa estar logado para participar de eventos.");
   //   return;
   // }

    if (!nomeFinal) {
      newErrors.nome = 'Informe o seu nome';
    }

    if (!whatsapp.trim()) {
      newErrors.whatsapp = 'Informe um número de WhatsApp';
    }

    if (!emailFinal) {
      newErrors.email = 'Informe um e-mail';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch('/api/participacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventoId: eventos.id,
          nome: nomeFinal,
          email: emailFinal,
          whatsapp: whatsapp,
        }),
      });

      if (!res.ok) throw new Error('Erro ao registrar participação');

      setParticipar(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      alert('Não foi possível registrar sua participação.');
    }
  };

  return (
    <div onClick={onClose} className={styles.overlay}>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalStyle}>
        <button onClick={onClose} className={styles.closeButton}>x</button>

        <div className={styles.contentContainer}>
          <div className={styles.info}>
            <h2 style={{ marginTop: 0 }}>{eventos.titulo}</h2>
            <p><strong>Descrição:</strong> {eventos.descricao}</p>
            <p><strong>Local:</strong> {eventos.local}</p>
            <p>
              <strong>Data:</strong>{' '}
              {new Date(eventos.dataIni).toLocaleDateString('pt-BR')} até{' '}
              {new Date(eventos.dataFim).toLocaleDateString('pt-BR')}
            </p>

            <div className={styles.form}>
              <input
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={`${styles.input} ${errors.nome ? styles.inputErro : ''}`}
              />
              {errors.nome && (
                <div className={styles.feedbackErro}>{errors.nome}</div>
              )}


              <input
                type="text"
                placeholder="(99) 99999-9999"
                value={whatsapp}
                onChange={(e) => {
                  let input = e.target.value.replace(/\D/g, '');
                  if (input.length > 11) input = input.slice(0, 11);
                  const formatted = input
                    .replace(/^(\d{2})(\d)/, '($1) $2')
                    .replace(/(\d{5})(\d)/, '$1-$2');

                  setWhatsapp(formatted);
                }}
                className={`${styles.input} ${errors.whatsapp ? styles.inputErro : ''}`}
              />
              {errors.whatsapp && (
                <div className={styles.feedbackErro}>{errors.whatsapp}</div>
              )}

              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${styles.input} ${errors.email ? styles.inputErro : ''}`}
              />
              {errors.email && (
                <div className={styles.feedbackErro}>{errors.email}</div>
              )}
            </div>

            <button
              className={`${styles.button} ${participar ? styles.confirmado : ''}`}
              onClick={handleParticipar}
              disabled={participar}
            >
              {participar ? (
                <span className={styles.confirmadoContent}>
                  <span className={styles.checkIcon}>✔</span> Confirmado
                </span>
              ) : (
                'Participar'
              )}
            </button>
          </div>

          <div className={styles.imageContainer}>
            <Image
              src={eventos.imagem || IconeUpload}
              alt={`Imagem do evento ${eventos.titulo}`}
              width={300}
              height={300}
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
