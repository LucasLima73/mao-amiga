'use client';
import React from 'react';

interface AboutButtonProps {
}

const AboutButton: React.FC<AboutButtonProps> = () => {
  return (
    <button
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '4px solid #ffde59',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.98)';
        e.currentTarget.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.2)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.2)';
      }}
    >
      <span
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#ffde59',
        }}
      >
        ?
      </span>
    </button>
  );
};

export default AboutButton;
