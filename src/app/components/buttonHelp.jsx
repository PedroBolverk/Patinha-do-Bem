'use client';

import './buttonHelp.css';

export default function BotaoAjuda() {
  return (
    <div className="botao-ajuda-wrapper">
      <button
        className="botao-ajuda-flutuante"
        onClick={() => window.iniciarTour?.()}
        title="Ver ajuda ou tour"
      >
        ❓
      </button>
      <span className="botao-ajuda-label">Ajuda</span>
    </div>
  );
}
