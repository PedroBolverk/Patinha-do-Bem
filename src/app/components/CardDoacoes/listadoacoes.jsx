import CardDoacao from './index';
import styles from './style.module.css';

export default function ListaDoacoes({ doacoes }) {
  return (
    <div className={styles.container}>
      {doacoes.map((doacao, index) => (
        <CardDoacao key={index} doacao={doacao} />
      ))}
    </div>
  );
}
