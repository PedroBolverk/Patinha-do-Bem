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
  const [userImage, setUserImage] = useState(null);
  const [userRole, setUserRole] = useState(null);

  function updateUser() {
    const cookies = document.cookie;
const isLogged = cookies.includes('isLoggedIn=true');
if (!isLogged) return;


    const storedUsername = localStorage.getItem('username');
    const storedImage = localStorage.getItem('userImage');
    const storedUserRole = localStorage.getItem('userRole');

    setUsername(storedUsername || null);
    setUserImage(storedImage || null);
    setUserRole(storedUserRole || null);

    window.dispatchEvent(new Event('userRoleChanged'));
  }


  useEffect(() => {
    updateUser();
  }, []);

 const handleLogout = () => {
  // Remove cookie corretamente
  document.cookie = 'isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

  // Limpa localStorage
  localStorage.removeItem('username');
  localStorage.removeItem('userImage');
  localStorage.removeItem('userRole');

  setUsername(null);
  setUserImage(null);
  setUserRole(null);

  window.dispatchEvent(new Event('userRoleChanged'));

  // Garante atualização da interface (opcional)
  window.location.reload();
};


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

          {userRole === 'ORGANIZADOR' && (
            <Link href="/PagePainel" className={styles.HeaderLink}>Painel</Link>
          )}

          {username ? (
            <div
              className={styles.HeaderLink}
              style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
            >
              <span>Olá, {username.split(' ')[0]}</span>

              <Link className={styles.HeaderLink} href='/'><span
                style={{ cursor: 'pointer', color: 'red' }}
                onClick={handleLogout}
              >
                Sair
              </span>
              </Link>
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

          <div className={styles.ImageWrapper}>
            <Image
              src={userImage || Login}
              alt="Ícone de Login"
              fill
              sizes="(max-width: 768px) 32px, 40px"
              className={styles.LogoLogin}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </nav>
      </div>

      <LoginModal
        show={showLogin}
        handleClose={() => {
          setShowLogin(false);
          updateUser();
        }}
        openRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        onLoginSuccess={updateUser}
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
