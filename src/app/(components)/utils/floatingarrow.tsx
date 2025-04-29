'use client';
import React from 'react';

interface FloatingArrowProps {
  onClick?: () => void;
}

const FloatingArrow: React.FC<FloatingArrowProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute', // Para posicionamento flutuante
        bottom: '10%', // Ajuste para deixá-la acima da parte inferior
        left: '50%', // Centraliza horizontalmente
        transform: 'translateX(-50%)', // Centraliza exato pela largura
        zIndex: 1000, // Garante que fique acima de outros elementos
        animation: 'float 2s infinite',
        cursor: 'pointer', // Para indicar que é clicável
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffde59"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6"></path>
      </svg>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translate(-50%, 0);
          }
          50% {
            transform: translate(-50%, -10px);
          }
          100% {
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingArrow;
