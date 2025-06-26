'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import IconeUpload from '@/app/Pageeventos/iconUpload.png';
import styles from './style.module.css';
import { QRCodeSVG } from 'qrcode.react';

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return value;
  }
  return null;
}

export default function Modalevento({ evento, onClose }) {
  const inputFileRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [participar, setParticipar] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [whatsappLink, setWhatsappLink] = useState(null);
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    setSelectedImage(null);
    setParticipar(false);
    setErrors({});
  }, [evento]);

  if (!evento) return null;

 const handleParticipar = async () => {
  console.log('[handleParticipar] Função chamada');  // Log para garantir que a função foi chamada

  const newErrors = {};
  const nomeLS = localStorage.getItem('nomedeusuario');
  const emailLS = localStorage.getItem('userEmail');
  const nomeFinal = nome.trim();
  const emailFinal = email.trim() || emailLS || '';

  if (!nomeFinal) {
    newErrors.nome = 'Informe seu nome';
  }
  if (!emailFinal) {
    newErrors.email = 'Informe um e-mail';
  }
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    console.log('[ENVIANDO DADOS PARA API]', {
      eventoId: evento.id,  // Aqui estamos usando 'evento' para acessar as informações do evento
      nome: nomeFinal,
      email: emailFinal,
      valorEvento: evento.valorEvento,  // Usando 'evento' para acessar as propriedades do evento
    });

    setLoading(true);

    const res = await fetch('/api/participacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventoId: evento.id,  // Usando 'evento'
        nome: nomeFinal,
        email: emailFinal,
        valorEvento: evento.valorEvento,  // Usando 'evento'
        whatsapp: whatsapp,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[ERRO API PARTICIPAÇÃO]', data);
      alert(data.error || 'Erro ao processar participação');
      return;
    }

    console.log('[PAYLOAD RECEBIDO]', data.payload);  // Log para verificar o payload

    setPayload(data.payload);

    // Gerar o número de WhatsApp após a participação ser confirmada
    const numero = evento.organizador?.whatsapp.replace(/\D/g, '');
    console.log('[Número do WhatsApp do Organizador]:', numero);  // Log para verificar o número

    const msg = encodeURIComponent(
      `Olá ${evento.organizador?.name}, sou ${nome}, acabei de me inscrever para o evento "${evento.titulo}". Segue o comprovante do evento gerado.`
    );

    // Condicional para gerar o link adequado
    let link;
    if (numero) {
        setWhatsappLink(`https://wa.me/55${numero}?text=${msg}`);
      } else {
        setWhatsappLink(null);
      }
  } catch (err) {
    console.error('[ERRO FATAL PARTICIPAÇÃO]', err);
    alert('Erro ao processar evento. Tente novamente.');
  } finally {
    setLoading(false);
  }
};

const handleConfirmarPagamento = () => {
  // Verifica se o link do WhatsApp foi gerado
  if (!whatsappLink) {
    console.error('[ERRO] Link do WhatsApp não gerado');
    return;
  }

  setConfirmado(true);

  console.log('[Abrindo link do WhatsApp]', whatsappLink);  // Verificar o link que está sendo aberto

  // Abre o WhatsApp apenas uma vez
  setTimeout(() => {
    window.open(whatsappLink, '_blank');
    handleClose(); // Chama handleClose para fechar o modal
  }, 700);
};

const handleClose = () => {
  // Impede o fechamento se o WhatsApp não tiver sido gerado
  if (!whatsappLink) return;

  // Apenas fecha o modal sem tentar abrir o WhatsApp novamente
  setTimeout(() => {
 
    setNome('');
    setEmail('');
    setWhatsapp('');
    setPayload(null);
    setWhatsappLink(null);
    setLoading(false);
    setConfirmado(false);
    onClose(); // Fecha o modal
  }, 700);
};

  return (
    <div onClick={handleClose} className={styles.overlay}>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalStyle}>
        <button onClick={onClose} className={styles.closeButton}>x</button>

        <div className={styles.contentContainer}>
          <div className={styles.info}>
            <h2 style={{ marginTop: 0 }}>{evento.titulo}</h2>
            <p><strong>Descrição:</strong> {evento.descricao}</p>
            <p><strong>Local:</strong> {evento.local}</p>
            <p><strong>Local:</strong> {evento.organizador?.whatsapp}</p>

            <p>
              <strong>Data:</strong>{' '}
              {new Date(evento.dataIni).toLocaleDateString('pt-BR')} até{' '}
              {new Date(evento.dataFim).toLocaleDateString('pt-BR')}
            </p>
            <p><strong>Valor do Evento:</strong> R$ {evento.valorEvento}</p>

            {!payload && (
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
                <button
                  className={`${styles.button} ${participar ? styles.confirmado : ''}`}
                  onClick={handleParticipar}
                  disabled={participar}
                >
                  {loading ? 'Gerando Pix...' : 'Participar'}
                </button>
              </div>
            )}

          </div>
          {payload && (
            <div className={styles.resultado}>
              <h3>Escaneie o QR Code abaixo para doar:</h3>
              <QRCodeSVG value={payload.trim()} size={200} />
              <p>Ou copie o código Pix:</p>
              <textarea readOnly value={payload} rows={3} />

               {whatsappLink ? (
              <button
                className={`${styles.button} ${confirmado ? styles.confirmado : ''}`}
                onClick={handleConfirmarPagamento}
                disabled={confirmado}
              >
                {confirmado ? (
                  <span className={styles.confirmadoContent}>
                    <span className={`${styles.checkIcon} ${styles.spin}`}>✔</span>Confirmado
                  </span>
                ) : (
                  <span className={styles.confirmadoContent}>
                    <span className={styles.checkIcon}>✔</span> Já paguei (Confirmar via WhatsApp)
                  </span>
                )}
              </button>
            ) : (
              <p style={{ marginTop: '1rem', color: 'gray' }}>
                Número de WhatsApp não cadastrado pelo organizador.
              </p>
            )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}