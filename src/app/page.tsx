'use client';
import React from 'react';
import Link from 'next/link';
import WavyButton from './(components)/utils/wavybutton';
import FloatingArrow from './(components)/utils/floatingarrow';
import AboutButton from './(components)/utils/aboutbutton';
import Image from 'next/image';

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
          alignItems: 'flex-end', // Alinha o conteúdo no lado direito
          justifyContent: 'center', // Centraliza verticalmente
          position: 'relative',
          padding: '0 5%', // Adiciona padding para afastar o texto da borda direita
        }}
      >
        <FloatingArrow />
        <div
          style={{
            color: '#ffde59',
            fontSize: '3rem',
            fontFamily: "'Roboto', sans-serif",
            lineHeight: '1.5',
            textAlign: 'right', // Garante que o texto seja alinhado à direita
          }}
        >
          <p>INCLUSÃO,</p>
          <p>CIDADANIA E</p>
          <p>ACOLHIMENTO</p>
        </div>
      </div>

      {/* Bloco "O que é?" centralizado */}
      <div
        style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Centraliza horizontalmente
          justifyContent: 'center', // Centraliza verticalmente
          textAlign: 'center',
          backgroundColor: '#fff',
          padding: '20px',
        }}
      >
        <h2
          style={{
            fontFamily: "'Gochi Hand', cursive",
            fontSize: '4rem',
            color: '#ffde59',
            marginBottom: '30px',
          }}
        >
          O QUE É?
        </h2>
        <p
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: '1rem',
            color: '#333',
            lineHeight: '1.8',
            maxWidth: '800px',
            marginBottom: '20px',
          }}
        >
          O Mão Amiga é um projeto voltado para apoiar refugiados no Brasil,
          integrando tecnologia para enfrentar desafios legais, culturais e linguísticos.
          Seu principal objetivo é oferecer um aplicativo acessível que conecta refugiados
          a informações e serviços essenciais, como regularização documental, acesso à saúde,
          educação, trabalho e integração social.
        </p>
        <p
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: '1rem',
            color: '#333',
            lineHeight: '1.8',
            maxWidth: '800px',
          }}
        >
          A plataforma promove inclusão ao simplificar o acesso a direitos e criar um ambiente
          de acolhimento, com recursos como mapas de serviços, guias explicativos e suporte em
          múltiplos idiomas.
        </p>
      </div>

      {/* Bloco de Trilhas centralizado */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#FFDE59', // Fundo amarelo
          padding: '0', // Remove qualquer espaçamento interno
        }}
      >
        <Image
          src="/assets/images/divisoria.png" // Caminho relativo à pasta public
          alt="Divisória visual"
          width={100} // Largura total (ajuste conforme necessário)
          height={100} // Altura (ajuste conforme necessário)
          style={{
            display: 'block', // Garante que a imagem ocupe o espaço completo
            margin: '0 auto', // Centraliza a imagem horizontalmente
          }}
        />
        <div
          style={{
            height: 'calc(100vh - 100px)', // Ajusta a altura para compensar a altura da imagem
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Centraliza horizontalmente
            justifyContent: 'center', // Centraliza verticalmente
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <h1
            style={{
              fontFamily: "'Gochi Hand', cursive",
              fontSize: '4rem',
              color: '#fff', // Título branco
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
              flexDirection: 'column', // Coloca os botões em uma única coluna
              alignItems: 'center', // Centraliza os botões horizontalmente
              gap: '20px', // Espaçamento entre os botões
              maxWidth: '300px', // Limita a largura máxima dos botões
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
