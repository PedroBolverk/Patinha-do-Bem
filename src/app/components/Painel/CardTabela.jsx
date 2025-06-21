'use client';
import styles from './style.module.css';
import { useState } from 'react';

export default function CardLinhaPainel({
  id,
  valor,
  titulo,
  nome,
  whatsapp,
  email,
  data,
  status,
  onConfirm
}) {
  const [confirmando, setConfirmando] = useState(false);

  const statusLower = status?.toLowerCase();
  const statusClass = {
    confirmado: styles.statusVerde,
    aguardando: styles.statusAmarelo,
    recusado: styles.statusVermelho,
    pending: styles.statusAmarelo,
    confirmed: styles.statusVerde,
  }[statusLower] || styles.statusCinza;

  const handleConfirmar = async () => {
    if (!id || !onConfirm) return;
    setConfirmando(true);
    try {
      await onConfirm(id);
    } catch (err) {
      console.error(err);
      alert('Erro ao confirmar doação');
    } finally {
      setConfirmando(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.coluna}>
        <strong>R$ {valor?.toLocaleString('pt-BR') ?? 'Free'}</strong>
        <div>{nome || 'Anônimo'}</div>
        <div>{whatsapp}</div>
        <div className={styles.email}>{email || '---'}</div>
      </div>

      <div className={styles.coluna}>
        <div className={styles.titulo}><strong>{titulo}</strong></div>
        <span>Data:</span>
        <div>{new Date(data).toLocaleString('pt-BR')}</div>
      </div>

      <div className={`${styles.status} ${statusClass}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || '---'}
      </div>

      {statusLower !== 'confirmado' && statusLower !== 'confirmed' && (
        <button
          onClick={handleConfirmar}
          className={styles.botaoConfirmar}
          disabled={confirmando}
        >
          {confirmando ? 'Confirmando...' : 'Confirmar'}
        </button>
      )}
    </div>
  );
}
