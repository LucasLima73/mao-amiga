// FloatingArrow.tsx (permanece igual, já aceita onClick)
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
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        animation: 'float 2s infinite',
        cursor: 'pointer',
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
          0%   { transform: translate(-50%, 0); }
          50%  { transform: translate(-50%, -10px); }
          100% { transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
};

export default FloatingArrow;
