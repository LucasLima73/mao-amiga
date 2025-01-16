'use client';
import React from 'react';

const Navbar = () => {
  return (
    <nav
      style={{
        position: 'fixed', // Mantém a navbar no topo
        top: 0,
        left: 0,
        width: '100%',
        height: '80px', // Altura da navbar
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 9999, // Garante que a navbar fique acima de outros elementos
        padding: '0 50px',
        fontFamily: "'Roboto', sans-serif", // Fonte alterada para Roboto
        fontSize: '1.5rem',
      }}
    >
      {/* Título */}
      <h1
      >
        <a href="/"
                style={{
                  fontSize: '2.5rem',
                  color: '#ffde59',
                  margin: 0,
                }}
                >
        MÃO AMIGA
        </a>
      </h1>

      {/* Links */}
      <ul
        style={{
          display: 'flex',
          listStyleType: 'none',
          gap: '40px',
          margin: 0,
          padding: 0,
        }}
      >
        <li>
          <a
            href="/trilhaSaude"
            style={{
              textDecoration: 'none',
              color: '#ffde59',
              transition: 'color 0.3s ease',
            }}
            onMouseOver={(e) => ((e.target as HTMLAnchorElement).style.color = '#ffffff')}
            onMouseOut={(e) => ((e.target as HTMLAnchorElement).style.color = '#ffde59')}
          >
            SAÚDE
          </a>
        </li>
        <li>
          <a
            href="#documentacao"
            style={{
              textDecoration: 'none',
              color: '#ffde59',
              transition: 'color 0.3s ease',
            }}
            onMouseOver={(e) => ((e.target as HTMLAnchorElement).style.color = '#ffffff')}
            onMouseOut={(e) => ((e.target as HTMLAnchorElement).style.color = '#ffde59')}
          >
            DOCUMENTAÇÃO
          </a>
        </li>
        <li>
          <a
            href="#direitos-humanos"
            style={{
              textDecoration: 'none',
              color: '#ffde59',
              transition: 'color 0.3s ease',
            }}
            onMouseOver={(e) => ((e.target as HTMLAnchorElement).style.color = '#ffffff')}
            onMouseOut={(e) => ((e.target as HTMLAnchorElement).style.color = '#ffde59')}
          >
            DIREITOS HUMANOS
          </a>
        </li>
        <li>
          <a
            href="#socioeconomico"
            style={{
              textDecoration: 'none',
              color: '#ffde59',
              transition: 'color 0.3s ease',
            }}
            onMouseOver={(e) => ((e.target as HTMLAnchorElement).style.color = '#ffffff')}
            onMouseOut={(e) => ((e.target as HTMLAnchorElement).style.color = '#ffde59')}
          >
            SOCIOECONÔMICO
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
