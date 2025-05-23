import styles from '@/app/components/CardDoacoes/style.module.css'
import Link from 'next/link'

export default function CadastrarEvento () {

return (
<Link href="/CadastroEventos" className={styles.botaoCadastrar}>Cadastre seu Evento</Link>

)

}

