'use client';
import styles from './style.module.css'

export default function CardLinhaPainel({ valor, titulo, nome, email, data, status }) {
  const statusClass = {
    confirmado: styles.statusVerde,
    aguardando: styles.statusAmarelo,
    recusado: styles.statusVermelho,
  }[status?.toLowerCase()] || styles.statusCinza;

  return (
    <div className={styles.card}>
      <div className={styles.coluna}>
        <strong>R$ {valor?.toLocaleString('pt-BR') ?? '0,00'}</strong>
        <div>{nome}</div>
        <div className={styles.email}>{email}</div>
      </div>

      <div className={styles.coluna}>
        <div className={styles.titulo}>{titulo}</div>
        <span>Data de Confirmação</span><div>{new Date(data).toLocaleString('pt-BR')}</div>
      </div>

      <div className={`${styles.status} ${statusClass}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || '---'}
      </div>
    </div>
  );
}
