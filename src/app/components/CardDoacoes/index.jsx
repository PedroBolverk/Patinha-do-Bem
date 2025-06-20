import { useEffect, useState } from 'react';
import styles from './style.module.css';
import Image from 'next/image';

export default function CardDoacao({ doacao }) {
  if (!doacao) return null;

  const porcentagem = Math.min(
    Math.round((doacao.atual / doacao.meta) * 100),
    100
  );

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={doacao.imagem || "/default-image.jpg"}
          alt={`Imagem da campanha ${doacao.titulo}`}
          width={300}
          height={180}
          className={styles.image}
          unoptimized={!doacao.imagem}
        />
      </div>
      <h3 className={styles.titulo}>{doacao.titulo}</h3>
      <p className={styles.descricao}>{doacao.descricao}</p>
      <p><strong>Meta:</strong> R$ {doacao.meta}</p>
      <p><strong>Arrecadado:</strong> R$ {doacao.atual}</p>
      <p><strong>Representante:</strong> {doacao.author?.name}</p>
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: `${porcentagem}%` }} />
      </div>
      <span className={styles.porcentagem}>{porcentagem}% arrecadado</span>
    </div>
  );
}
