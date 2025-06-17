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
  const [payload, setPayload] = useState(null);
  const [whatsappLink, setWhatsappLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [valorFormatado, setValorFormatado] = useState('');
  const [valorNumerico, setValorNumerico] = useState(0);

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
    if (!valorNumerico || valorNumerico <= 0) {
      alert('Informe um valor válido para doar');
      return;
    }

    if (!doacao?.id) {
      alert('ID da campanha não encontrado!');
      return;
    }

    console.log('[ENVIANDO DADOS PARA API]', {
      amount: valorNumerico,
      postId: doacao.id,
      donorName: nome,
      donorEmail: email,
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
        `Olá ${doacao.author?.name}, acabei de realizar uma doação de R$ ${valorNumerico.toFixed(
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

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>×</button>
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
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.confirmar}
              >
                Já paguei (Confirmar via WhatsApp)
              </a>
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
