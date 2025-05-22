import styles from  '@/app/components/Header/style.module.css'
import logo from './logo.png';
import Login from './Login.png';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <div className={styles.StyledHeader}>
      <Link href="/" className={styles.TituloHeader}>
        <Image className={styles.LogoHeader} src={logo} alt="Logo Patinha do Bem" />
        <h1 className={styles.TitleHeader}>Patinha do Bem</h1>
      </Link>

      <div className={styles.Header}>
        <span className={styles.HeaderLink}>Ajuda</span>
        <Link href="/PageEventos" className={styles.HeaderLink}>Eventos</Link>
        <Link href="/PageDoacoes" className={styles.Linke}>
        <span className={styles.HeaderLink}>Doações</span>
</Link>

        <span className={styles.HeaderLink}>Login</span>
        <Image className={styles.LogoLogin} src={Login} alt="Logo de Login" />
      </div>
    </div>
  );
}