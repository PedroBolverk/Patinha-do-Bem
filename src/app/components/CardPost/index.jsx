"use client"
import Image from "next/image"
import caoegato from "./caoegato.png"
import './style.css'





export const CardHome = () => {

    return(
        <div className="ContainerEventos">
            <div>
        <h1 className="Titulo">Ajude-nos a salvar<br/> os Animais</h1>
        <h2 className="Subtitulo"> Junte-se a nós e faça a diferença na vida de animais necessitados</h2>
        <button className="BotaoDoar"><span className="SpanBotao">Doar Agora</span></button>
        </div>
        <Image className="Imagem" src={caoegato} alt="wallpaper"/>
         </div>
    );

};