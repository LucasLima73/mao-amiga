import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#fff',
        color: '#333',
        padding: '40px 20px',
        textAlign: 'center',
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* Contêiner geral */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        {/* Sobre o projeto */}
        <div style={{ flex: '1', minWidth: '250px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Mão Amiga</h3>
          <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>
            Um projeto dedicado a apoiar refugiados no Brasil, oferecendo acesso a
            serviços essenciais e suporte em desafios legais, culturais e linguísticos.
          </p>
        </div>

        {/* Links úteis */}
        <div style={{ flex: '1', minWidth: '250px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Links Úteis</h3>
          <ul style={{ listStyle: 'none', padding: '0', lineHeight: '2' }}>
            <li>
              <Link href="/trilhaSaude" style={{ textDecoration: 'none', color: '#333' }}>
                Acesso à Saúde
              </Link>
            </li>
            <li>
              <Link href="/trilhaDocumentacao" style={{ textDecoration: 'none', color: '#333' }}>
                Documentação
              </Link>
            </li>
            <li>
              <Link href="/trilhaDireitosHumanos" style={{ textDecoration: 'none', color: '#333' }}>
                Direitos Humanos
              </Link>
            </li>
            <li>
              <Link href="/trilhaSocioeconomico" style={{ textDecoration: 'none', color: '#333' }}>
                Apoio Socioeconômico
              </Link>
            </li>
          </ul>
        </div>

        {/* Contato */}
        <div style={{ flex: '1', minWidth: '250px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Contato</h3>
          <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>
            <strong>Email:</strong> contato@maoamiga.org.br
          </p>
          <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>
            <strong>Telefone:</strong> +55 (11) 99999-9999
          </p>
        </div>
      </div>

      {/* Rodapé inferior */}
      <div
        style={{
          borderTop: '1px solid #ddd',
          marginTop: '20px',
          paddingTop: '10px',
          fontSize: '0.9rem',
          color: '#555',
        }}
      >
        <p>&copy; {new Date().getFullYear()} Mão Amiga. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
