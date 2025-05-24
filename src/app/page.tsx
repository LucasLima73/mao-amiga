'use client';
import React, { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import WavyButton from './(components)/utils/wavybutton';
import NewsSection from './(components)/NewsSection';

// Mobile responsive components
import MobileMenu from './(components)/utils/MobileMenu';
import MobileNavbar from './(components)/utils/MobileNavbar';
import LanguageSelectionModal from './(components)/utils/LanguageSelectionModal';

// SEO components
import SEOProvider from './(components)/utils/SEOProvider';
import Breadcrumbs from './(components)/utils/Breadcrumbs';

const Home: React.FC = () => {
  const { t } = useTranslation();

  // scroll suave até "trilhas"
  const scrollToTrilhas = useCallback(() => {
    const el = document.getElementById('trilhas');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // controla menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // controla modal de seleção de idioma
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // verifica se é a primeira visita
  useEffect(() => {
    const hasSelectedLanguage = localStorage.getItem('language-selected');
    if (!hasSelectedLanguage) {
      setIsLanguageModalOpen(true);
    }
  }, []);

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* SEO Provider */}
      <SEOProvider
        title="Mão Amiga | Apoio a Imigrantes e Refugiados no Brasil"
        description="Plataforma de acolhimento e informações para imigrantes e refugiados no Brasil, com trilhas de acesso à saúde, direitos humanos, documentação e apoio socioeconômico."
        keywords={['imigrantes', 'refugiados', 'apoio', 'brasil', 'documentação', 'saúde', 'direitos humanos', 'inclusão']}
        ogImage="/assets/images/og-image.jpg"
        ogType="website"
        schemaType="WebPage"
      />

      {/* Hero */}
      <div
        style={{
          height: '100vh',
          width: '100%',
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('/assets/images/home.png')",
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
        {/* mostra setinha só se menu fechado */}

        <div
          style={{
            color: '#ffde59',
            fontSize: '3rem',
            fontFamily: "'Roboto', sans-serif",
            lineHeight: '1.5',
            textAlign: 'right',
          }}
        >
          <p>{t('inclusao')}</p>
          <p>{t('cidadania')}</p>
          <p>{t('acolhimento')}</p>
        </div>
      </div>

      {/* Seção de Trilhas */}
      <div
        id="trilhas"
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
              fontSize: '4rem',
              color: '#fff',
              marginBottom: '20px',
            }}
          >
            {t('trilhas_title')}
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
            {t('trilhas_description')}
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
            {/* botões de trilha */}
            <Link href="/trilhaSaude">
              <WavyButton
                buttonText={t('acesso_saude_button')}
                backgroundColor="#ffff"
                textColor="#000000"
              />
            </Link>
            <Link href="/trilhaDireitosHumanos">
              <WavyButton
                buttonText={t('direitos_humanos_button')}
                backgroundColor="#ffff"
                textColor="#000000"
              />
            </Link>
            <Link href="/trilhaDocumentacao">
              <WavyButton
                buttonText={t('documentacao_button')}
                backgroundColor="#ffff"
                textColor="#000000"
              />
            </Link>
            <Link href="/socioeconomico">
              <WavyButton
                buttonText={t('apoio_socioeconomico_button')}
                backgroundColor="#ffff"
                textColor="#000000"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Seção de Notícias */}
      <NewsSection />

      {/* Mobile menu: barra + overlay */}
      <div className="md:hidden">
        <MobileNavbar onOpenMenu={() => setIsMenuOpen(true)} />
        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>

      {/* Modal de seleção de idioma */}
      <LanguageSelectionModal 
        isOpen={isLanguageModalOpen} 
        onClose={() => setIsLanguageModalOpen(false)} 
      />
    </div>
  );
};

export default Home;
