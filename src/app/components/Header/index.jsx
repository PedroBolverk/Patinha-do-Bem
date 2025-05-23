'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/app/components/Header/style.module.css';
import logo from './logo.png';
import Login from './Login.png';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.StyledHeader}>
      <Link href="/" className={styles.TituloHeader}>
        <Image className={styles.LogoHeader} src={logo} alt="Logo Patinha do Bem" />
        <h1 className={styles.TitleHeader}>Patinha do Bem</h1>
      </Link>

      <button
        className={styles.HamburguerButton}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menu"
      >
        ☰
      </button>

      <nav className={`${styles.Header} ${menuOpen ? styles.ShowMenu : ''}`}>
        <span className={styles.HeaderLink}>Ajuda</span>
        <Link href="/PageEventos" className={styles.HeaderLink}>Eventos</Link>
        <Link href="/PageDoacoes" className={styles.Linke}>
          <span className={styles.HeaderLink}>Doações</span>
        </Link>
        <span className={styles.HeaderLink}>Login</span>
        <Image className={styles.LogoLogin} src={Login} alt="Logo de Login" />
      </nav>
    </div>
  );
}
