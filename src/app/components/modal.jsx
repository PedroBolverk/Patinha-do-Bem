'use client';
import styles from './Modal.module.css';

export default function Modal({ doacao, onClose }) {
  if (!doacao) return null;

  const porcentagem = Math.min(
    Math.round((doacao.atual / doacao.meta) * 100),
    100
  );

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
          <div
            className={styles.progress}
            style={{ width: `${porcentagem}%` }}
          />
        </div>

        <span className={styles.porcentagem}>{porcentagem}% arrecadado</span>

        <button className={styles.donate}>Doar</button>
      </div>
    </div>
  );
}
