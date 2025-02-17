'use client';

import React from 'react';

const SobrePage: React.FC = () => {
  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-[#f5cf18] mb-6 text-center">Sobre o Projeto Mão Amiga</h1>

      {/* Seção: Sobre o Projeto */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#f5cf18] mb-4">A Causa</h2>
        <p className="text-black text-lg leading-7">
          O projeto <strong>Mão Amiga</strong> nasceu com o objetivo de apoiar refugiados no Brasil,
          ajudando-os a superar barreiras sociais, culturais e linguísticas. Nossa missão é
          fornecer recursos acessíveis que facilitem a integração desses indivíduos em nossa
          sociedade, promovendo a igualdade e o respeito aos direitos humanos.
        </p>
      </section>

      {/* Seção: Integrantes do Projeto */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#f5cf18] mb-4 text-center">Integrantes do Projeto</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { nome: 'Integrante 1', funcao: 'Dev', imagem: '/assets/integrante1.jpg' },
            { nome: 'Integrante 2', funcao: 'Dev', imagem: '/assets/integrante2.jpg' },
            { nome: 'Integrante 3', funcao: 'Dev', imagem: '/assets/integrante3.jpg' },
            { nome: 'Integrante 4', funcao: 'Dev', imagem: '/assets/integrante4.jpg' },
          ].map((integrante, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={integrante.imagem}
                alt={`Foto de ${integrante.nome}`}
                className="w-24 h-24 rounded-full object-cover border-2 border-[#f5cf18] mb-4"
              />
              <p className="text-lg font-bold text-black">{integrante.nome}</p>
              <p className="text-sm text-gray-600">{integrante.funcao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seção: Visão de Futuro */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#f5cf18] mb-4">Visão de Futuro</h2>
        <p className="text-black text-lg leading-7">
          Nosso objetivo a longo prazo é expandir o Mão Amiga para incluir mais trilhas de suporte,
          parcerias com ONGs e integração com plataformas governamentais. Desejamos ser um
          ponto de referência para refugiados em busca de acolhimento e suporte.
        </p>
      </section>
    </div>
  );
};

export default SobrePage;
