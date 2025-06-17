'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
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
  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (user) {

        console.log('Imagem do usuário:', user?.image);
        
      localStorage.setItem('username', user.name || '');
      localStorage.setItem('userImage', user.image || '');
      localStorage.setItem('userRole', user.role || '');
      localStorage.setItem('userEmail', user.email || '');
      localStorage.setItem('userId', user.id?.toString() || '');

      document.cookie = 'isLoggedIn=true; path=/';
      window.dispatchEvent(new Event('userRoleChanged'));
    }
  }, [user]);

  const handleLogout = () => {
    
    localStorage.clear();
    document.cookie = 'isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    signOut({ callbackUrl: '/' });
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

          {user?.role === 'ORGANIZADOR' && (
            <Link href="/PagePainel" className={styles.HeaderLink}>Painel</Link>
          )}

          {user ? (
            <div
              className={styles.HeaderLink}
              style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
            >
              <span className={styles.HeaderLink}>
                Olá, {user.name?.split(' ')[0]}
              </span>

              <span
                onClick={handleLogout}
                style={{ cursor: 'pointer', color: 'red' }}
                className={styles.HeaderLink}
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

          <div className={styles.ImageWrapper}>
            <Link href="/PageProfile">
            <Image
              src={user?.image || Login}
              alt="Ícone de Login"
              fill
              sizes="(max-width: 768px) 32px, 40px"
              className={styles.LogoLogin}
              style={{ objectFit: 'cover' }}
            />
           </Link>
          </div>
          
        </nav>
      </div>
      

      <LoginModal
        show={showLogin}
        handleClose={() => setShowLogin(false)}
        openRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        onLoginSuccess={() => {
          setShowLogin(false);
          router.refresh?.();
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
