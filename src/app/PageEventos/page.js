"use client"
import { useState, useEffect} from 'react';
import Image from 'next/image';
import '@/app/components/CardsEventos/style.css'
import calendarioevents from '@/app/components/CardsEventos/calendarioevents.jpg'
export default  function EventosPage (){
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
    fetch('/api/eventos') //buscar eventos
      .then((res) => {
        if (!res.ok) throw new Error('Erro na resposta da API');//se nao carregar 
        return res.json(); 
      })
      .then((data) =>{
        setEventos(data);
        setLoading(false);
      })
      .catch((err) =>{
        console.error('Erro ao buscar eventos', err);
        setError('Erro ao carregar dados. Tente novamente.');
        setLoading(false);
      });      
  }, []);
        if (loading){
          return <div>Carregando Eventos...</div>
        }
        if (error){
          return <div>{error}</div>
        }
return(
<div>
    {eventos.length === 0 ? (
                    <p>Nenhum evento encontrado.</p>
                ) : (
                    <div className="ContentGrupo">
    
                        <h1 className="gabarito Eventos">Próximos Eventos</h1>
                        {eventos.map(evento => (
                            <div key={evento.id} className="ContentEventos">
                                <Image src={calendarioevents} width={32} height={36} alt="Ícone calendário" />
                                <div className="TituloEvento">
                                    {new Date(evento.dataIni).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })} <br />
                                    {evento.titulo}
                                </div>
                            </div>
                        ))}
    
    
                        <h3>Ver Todos</h3>
                    </div>
                )}
</div>

)};