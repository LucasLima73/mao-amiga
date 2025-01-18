'use client';
import React from 'react';

interface WavyButtonProps {
  buttonText?: string;
  backgroundColor?: string; // Cor de fundo dinâmica
  textColor?: string; // Cor do texto dinâmica
}

const WavyButton: React.FC<WavyButtonProps> = ({
  buttonText = 'Clique Aqui',
  backgroundColor = '#ffde59', // Cor de fundo padrão
  textColor = '#333', // Cor do texto padrão
}) => {
  return (
    <button
      style={{
        backgroundColor, // Usa a cor de fundo recebida como prop
        color: textColor, // Usa a cor do texto recebida como prop
        fontSize: '16px', // Tamanho do texto
        fontWeight: 'bold', // Texto em negrito
        border: 'none', // Sem borda
        padding: '10px 20px', // Espaçamento interno
        borderRadius: '50px', // Pontas onduladas
        cursor: 'pointer', // Cursor de clique
        transition: 'transform 0.2s ease, box-shadow 0.2s ease', // Animações suaves
        margin: '15px',
        width: '350px',
      }}
      onMouseOver={(e) => {
        (e.target as HTMLButtonElement).style.transform = 'scale(1.05)'; // Pequeno zoom ao passar o mouse
        (e.target as HTMLButtonElement).style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.2)'; // Aumenta a sombra
      }}
      onMouseOut={(e) => {
        (e.target as HTMLButtonElement).style.transform = 'scale(1)'; // Volta ao tamanho original
        (e.target as HTMLButtonElement).style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; // Volta à sombra original
      }}
      onMouseDown={(e) => {
        (e.target as HTMLButtonElement).style.transform = 'scale(0.98)'; // Leve redução ao clicar
        (e.target as HTMLButtonElement).style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.2)'; // Sombra mais suave ao clicar
      }}
      onMouseUp={(e) => {
        (e.target as HTMLButtonElement).style.transform = 'scale(1.05)'; // Volta ao zoom ao soltar o clique
        (e.target as HTMLButtonElement).style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.2)'; // Volta à sombra de hover
      }}
    >
      {buttonText}
    </button>
  );
};

export default WavyButton;
