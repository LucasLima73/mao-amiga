'use client';
import React from 'react';


import Link from 'next/link';
import WavyButton from './(components)/utils/wavybutton';
import FloatingArrow from './(components)/utils/floatingarrow';
import AboutButton from './(components)/utils/aboutbutton';
import ChatBotBalloon from './(components)/utils/ballon';

const Home = () => {
  return (
    <div
      style={{
        width: '100%',
        overflowX: 'hidden', // Impede scroll horizontal
      }}
    >
      <AboutButton />
      <div
        style={{
          height: '100vh',
          width: '100%',
          backgroundImage: "url('/assets/images/home.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative', // Garante o posicionamento correto da seta
        }}
      >
        <FloatingArrow />
        <ChatBotBalloon />
        <div
          style={{
            color: '#ffde59',
            fontSize: '3rem',
            fontFamily: "'Roboto', sans-serif",
            lineHeight: '1.5',
            textAlign: 'right',
            position: 'absolute',
            right: '5%',
            top: '50%',
            transform: 'translateY(-50%)', // Centraliza verticalmente
          }}
        >
          <p>INCLUSÃO,</p>
          <p>CIDADANIA E</p>
          <p>ACOLHIMENTO</p>
        </div>
      </div>

      <div
        style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: '#fff', // Fundo da segunda parte
          paddingTop: '50px',
        }}
      >
        <h1
          style={{
            fontFamily: "'Gochi Hand', cursive",
            fontSize: '7rem',
            color: '#ffde59',
            textAlign: 'center',
            lineHeight: '1.2',
            marginBottom: '20px',
            marginTop: '100px',
          }}
        >
          TRILHAS
        </h1>

        <Link href="/trilhaSaude">
          <WavyButton buttonText="ACESSO À SAÚDE" />
        </Link>

        <WavyButton buttonText="DOCUMENTAÇÃO" />
        <WavyButton buttonText="DIREITOS HUMANOS" />
        <WavyButton buttonText="APOIO SOCIOECONÔMICO" />
      </div>
    </div>
  );
};

export default Home;
