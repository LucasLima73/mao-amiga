'use client';
import React from 'react';
import Link from 'next/link';
import WavyButton from './(components)/utils/wavybutton';
import FloatingArrow from './(components)/utils/floatingarrow';
import AboutButton from './(components)/utils/aboutbutton';
import ChatBotBalloon from './(components)/utils/ballon';
import Image from 'next/image';

const Home = () => {
  return (
    <div
      style={{
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <AboutButton />
      <ChatBotBalloon />
      <div
        style={{
          height: '100vh',
          width: '100%',
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('/assets/images/home.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          position: 'relative',
          padding: '0 5%',
        }}
      >
        <FloatingArrow />
        <div
          style={{
            color: '#ffde59',
            fontSize: '3rem',
            fontFamily: "'Roboto', sans-serif",
            lineHeight: '1.5',
            textAlign: 'right',
          }}
        >
          <p>INCLUSÃO,</p>
          <p>CIDADANIA E</p>
          <p>ACOLHIMENTO</p>
        </div>
      </div>

      <div
        style={{
          width: '100%',
          backgroundColor: '#FFDE59',
          padding: '0',
        }}
      >
        <div
          style={{
            height: 'calc(100vh - 100px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <h1
            style={{
              fontFamily: "'Gochi Hand', cursive",
              fontSize: '4rem',
              color: '#fff',
              marginBottom: '20px',
            }}
          >
            TRILHAS
          </h1>
          <p
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: '1rem',
              color: '#333',
              lineHeight: '1.8',
              maxWidth: '800px',
              marginBottom: '40px',
            }}
          >
            As trilhas têm como objetivo facilitar a integração de refugiados no Brasil,
            oferecendo suporte prático para desafios legais, culturais e linguísticos.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              maxWidth: '300px',
              width: '100%',
            }}
          >
            <Link href="/trilhaSaude">
              <WavyButton buttonText="ACESSO À SAÚDE" backgroundColor="#ffff" textColor="#000000" />
            </Link>
            <Link href="/trilhaDireitosHumanos">
              <WavyButton buttonText="DIREITOS HUMANOS" backgroundColor="#ffff" textColor="#000000"/>
            </Link>
            <Link href="/trilhaDocumentacao">
              <WavyButton buttonText="DOCUMENTAÇÃO" backgroundColor="#ffff" textColor="#000000"/>
            </Link>
            <Link href="/trilhaSocioeconomico">
              <WavyButton buttonText="APOIO SOCIOECONÔMICO" backgroundColor="#ffff" textColor="#000000"/>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
