'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/app/components/Header/style.module.css';
import logo from './logo.png';
import Login from './Login.png';
import LoginModal from '@/app/Modals/Login/modalLogin';
import RegisterModal from '@/app/Modals/Register/modalRegister';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <>
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


          {username ? (
            <div className={styles.HeaderLink} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span>Olá, {username.split(' ')[0]}</span>
              <span
                style={{ cursor: 'pointer', color: 'red' }}
                onClick={() => {
                  localStorage.removeItem('username'); // limpa o nome salvo
                  setUsername(null); // atualiza o estado para remover o nome do header
                }}
              >
                Sair
              </span>
            </div>
          ) : (
            <span
              className={styles.HeaderLink}
              onClick={() => setShowLogin(true)}
              style={{ cursor: 'pointer' }}
            >
              Login
            </span>
          )}

          <Image className={styles.LogoLogin} src={Login} alt="Ícone de Login" />
        </nav>
      </div>


      <LoginModal
        show={showLogin}
        handleClose={() => {
          setShowLogin(false);
          const storedUsername = localStorage.getItem('username');
          if (storedUsername) setUsername(storedUsername);
        }}
        openRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />

      <RegisterModal
        show={showRegister}
        handleClose={() => setShowRegister(false)}
        openLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}
