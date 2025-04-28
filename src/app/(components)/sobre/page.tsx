'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const SobrePage: React.FC = () => {
  const { t } = useTranslation();

  const integrantes = [
    { nome: t('about.member1.name'), funcao: t('about.member1.role'), imagem: '/assets/images/integrante1.png' },
    { nome: t('about.member2.name'), funcao: t('about.member2.role'), imagem: '/assets/images/integrante2.png' },
    { nome: t('about.member3.name'), funcao: t('about.member3.role'), imagem: '/assets/images/integrante3.png' },
    { nome: t('about.member4.name'), funcao: t('about.member4.role'), imagem: '/assets/images/integrante4.png' },
  ];

  return (
    <div className="bg-gray-700 min-h-screen pt-[20vh] px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#f5cf18] mb-6 text-center">
          {t('about.title')}
        </h1>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#f5cf18] mb-4">{t('about.cause.title')}</h2>
          <p className="text-white text-lg leading-7">
            {t('about.cause.description1')} <strong>Mão Amiga</strong> {t('about.cause.description2')}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#f5cf18] mb-10 text-center">
            {t('about.members_title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {integrantes.map((integrante, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-52 h-52 rounded-full border-2 border-[#f5cf18] mb-4 bg-center bg-cover"
                  style={{ backgroundImage: `url(${integrante.imagem})` }}
                />
                <p className="text-lg font-bold text-white">
                  {integrante.nome}
                </p>
                <p className="text-sm text-gray-100">
                  {integrante.funcao}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#f5cf18] mb-4">{t('about.future.title')}</h2>
          <p className="text-white text-lg leading-7">
            {t('about.future.description')}
          </p>
        </section>
      </div>
    </div>
  );
};

export default SobrePage;
