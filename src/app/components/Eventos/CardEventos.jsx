import Image from "next/image";
import styles from './style.module.css'
export default function EventoCard({ evento, onSelect }) {
  return (
    <div
      className={styles.card}
      onClick={() => onSelect(evento)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(evento);
      }}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={evento.imagem || "/default-image.jpg"}
          alt={`Imagem do evento ${evento.titulo}`}
          width={300}
          height={180}
          className={styles.image}
          unoptimized={evento.imagem ? false : true}
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{evento.titulo}</h3>
        <p><strong>Representante:</strong> {evento.organizador?.name}</p>
        <p className={styles.desc}>{evento.descricao}</p>
      </div>
    </div>
  );
}