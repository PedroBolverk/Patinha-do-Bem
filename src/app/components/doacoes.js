import ListaDoacoes from "./CardDoacoes/listadoacoes";

export default function Doacoes ({ doacoes}) {
    return (
        <div>
        {doacoes.map(doacao => (
          <ListaDoacoes key={doacao.id} doacao={doacao} />
        ))}
      </div>
        
            );
}