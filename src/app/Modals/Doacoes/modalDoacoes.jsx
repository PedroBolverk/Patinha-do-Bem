'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import styles from './Modal.module.css';
import { useSession } from 'next-auth/react';

export default function ModalDoacoes({ doacao, onClose }) {
  const { data: session } = useSession();

  const [valorRaw, setValorRaw] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [payload, setPayload] = useState(null);
  const [whatsappLink, setWhatsappLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [valorFormatado, setValorFormatado] = useState('');
  const [valorNumerico, setValorNumerico] = useState(0);
  const [confirmado, setConfirmado] = useState(false);
  const [errors, setErrors] = useState({});

  if (!doacao) return null;

  const handleValorChange = (e) => {
    const entrada = e.target.value.replace(/\D/g, '');
    setValorRaw(entrada);

    const numero = parseFloat(entrada) / 100;

    if (!isNaN(numero)) {
      setValorNumerico(numero);
      setValorFormatado(
        numero.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
        })
      );
    } else {
      setValorNumerico(0);
      setValorFormatado('');
    }
  };

  const porcentagem = Math.min(
    Math.round((doacao.atual / doacao.meta) * 100),
    100
  );

  const handleDoar = async () => {
    const newErrors = {};
    if (!valorNumerico || valorNumerico <= 0) {
      newErrors.valor = 'Informe um valor válido';
    }
    if (!whatsapp.trim()) {
      newErrors.whatsapp = 'Informe um número de WhatsApp';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('[ENVIANDO DADOS PARA API]', {
      amount: valorNumerico,
      postId: doacao.id,
      donorName: nome,
      donorEmail: email,
      whatsapp: whatsapp,
    });

    setLoading(true);

    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: valorNumerico,
          postId: doacao.id,
          donorName: nome,
          donorEmail: email,
          whatsapp: whatsapp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('[ERRO API DOAÇÃO]', data);
        alert(data.error || 'Erro ao processar doação');
        return;
      }

      console.log('[PAYLOAD RECEBIDO]', data.payload);

      setPayload(data.payload);

      const numero = doacao.author?.whatsapp?.replace(/\D/g, '');
      const msg = encodeURIComponent(
        `Olá ${doacao.author?.name}, sou ${nome} acabei de realizar uma doação de R$ ${valorNumerico.toFixed(
          2
        )} para a campanha "${doacao.titulo}". Segue o comprovante do PIX gerado.`
      );

      if (numero) {
        setWhatsappLink(`https://wa.me/55${numero}?text=${msg}`);
      } else {
        setWhatsappLink(null);
      }
    } catch (err) {
      console.error('[ERRO FATAL DOAÇÃO]', err);
      alert('Erro ao processar doação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  const handleConfirmarPagamento = () => {
    if (!whatsappLink) return;

    setConfirmado(true);

    setTimeout(() => {
      window.open(whatsappLink, '_blank');
      handleClose();
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }, 700);
  };


  const handleClose = () => {

    if (!whatsappLink) return;
    setConfirmado(true);
    setTimeout(() => {
      window.open(whatsappLink, '_blank');
      handleClose();
    }, 700);

    setValorRaw('');
    setNome('');
    setEmail('');
    setWhatsapp('');
    setPayload(null);
    setWhatsappLink(null);
    setLoading(false);
    setValorFormatado('');
    setValorNumerico(0);
    setConfirmado(false);
    onClose();

  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>x</button>
        <h2>{doacao.titulo}</h2>
        <p>{doacao.descricao}</p>
        <p><strong>Meta:</strong> R$ {doacao.meta}</p>
        <p><strong>Arrecadado:</strong> R$ {doacao.atual}</p>
        <p><strong>Representante:</strong> {doacao.author?.name}</p>

        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${porcentagem}%` }} />
        </div>

        <span className={styles.porcentagem}>{porcentagem}% arrecadado</span>

        {!payload && (
          <div className={styles.form}>
            <input
              type="text"
              placeholder="Valor da doação"
              value={valorFormatado}
              onChange={handleValorChange}
            />
            {valorNumerico > 0 && (
              <p>Você está doando: {valorFormatado}</p>
            )}
            <input
              type="text"
              placeholder="Seu nome (opcional)"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
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
              placeholder="Seu e-mail (opcional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleDoar}
              className={styles.donate}
              disabled={loading}
            >
              {loading ? 'Gerando Pix...' : 'Doar'}
            </button>
          </div>
        )}

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
  );
}
