"use client";

import React, { useState, useEffect } from "react";

const faqData = [
  {
    title: 'O que são Direitos Humanos e como se aplicam a refugiados e imigrantes?',
    content: (
      <>
        Direitos Humanos são garantias universais e inalienáveis que asseguram dignidade e igualdade a todos os seres humanos, independentemente de nacionalidade, etnia, gênero ou status migratório. Refugiados e imigrantes têm os mesmos direitos fundamentais que qualquer pessoa, conforme estabelecido na Declaração Universal dos Direitos Humanos (DUDH), de 1948. <br />
        📄 <a href="https://www.ohchr.org/sites/default/files/UDHR/Documents/UDHR_Translations/por.pdf" className="underline text-blue-600" target="_blank">Leia a DUDH (PDF - ONU)</a>
      </>
    )
  },
  {
    title: 'O que é um refugiado e como ele é definido pela lei internacional?',
    content: (
      <>
        Segundo a Convenção de 1951 sobre o Estatuto dos Refugiados, refugiado é qualquer pessoa que, por fundado temor de perseguição por motivos de raça, religião, nacionalidade, opinião política ou pertencimento a determinado grupo social, se encontra fora de seu país de origem e não pode ou não quer regressar a ele.
      </>
    )
  },
  {
    title: 'Quais são os principais instrumentos internacionais que protegem os refugiados?',
    content: (
      <ul className="list-disc ml-6">
        <li>Convenção de 1951 sobre o Estatuto dos Refugiados</li>
        <li>Protocolo de 1967</li>
        <li>Convenção de Genebra</li>
        <li>Pacto Global sobre Refugiados da ONU (2018)</li>
      </ul>
    )
  },
  {
    title: 'Quais são os principais direitos dos refugiados?',
    content: (
      <>
        <ul className="list-disc ml-6">
          <li>Asilo e proteção contra deportação</li>
          <li>Segurança pessoal e integridade física</li>
          <li>Liberdade de expressão, religião e movimento</li>
          <li>Acesso à educação, saúde, moradia e trabalho</li>
          <li>Reagrupamento familiar</li>
          <li>Documentação legal e identidade</li>
        </ul>
        🔗 <a href="https://www.acnur.org/portugues" className="underline text-blue-600" target="_blank">Saiba mais</a>
      </>
    )
  },
  {
    title: 'Quais são os principais desafios enfrentados por refugiados e imigrantes?',
    content: (
      <ul className="list-disc ml-6">
        <li>Discriminação, xenofobia e racismo institucional</li>
        <li>Barreiras linguísticas e culturais</li>
        <li>Dificuldade para acessar serviços básicos e oportunidades de trabalho</li>
        <li>Falta de regularização e morosidade em processos de refúgio</li>
        <li>Vulnerabilidade a abusos, exploração e tráfico de pessoas</li>
      </ul>
    )
  },
  {
    title: 'Quais são as organizações que ajudam refugiados no Brasil?',
    content: (
      <ul className="list-disc ml-6">
        <li><a href="https://www.acnur.org/portugues" target="_blank" className="underline text-blue-600">ACNUR – Agência da ONU para Refugiados</a></li>
        <li><a href="https://adus.org.br/" target="_blank" className="underline text-blue-600">ADUS</a></li>
        <li><a href="https://www.migrante.org.br" target="_blank" className="underline text-blue-600">IMDH</a></li>
        <li><a href="https://missaonspaz.org" target="_blank" className="underline text-blue-600">Missão Paz (SP)</a></li>
        <li><a href="https://caritas.org.br" target="_blank" className="underline text-blue-600">Caritas Brasileira</a></li>
        <li><a href="https://www.prefeitura.sp.gov.br/cidade/secretarias/direitos_humanos/imigrantes/" target="_blank" className="underline text-blue-600">Centro de Referência para Imigrantes (SP)</a></li>
      </ul>
    )
  },
  {
    title: 'Como refugiados são protegidos em tempos de guerra ou crise humanitária?',
    content: (
      <>
        Durante guerras e crises, os refugiados têm direito à proteção internacional. A Convenção de Genebra e outros tratados proíbem sua deportação para locais onde correm risco. A assistência humanitária é provida por agências como ACNUR, Cruz Vermelha, Médicos Sem Fronteiras. <br />
        🔗 <a href="https://www.icrc.org/pt" target="_blank" className="underline text-blue-600">Comitê Internacional da Cruz Vermelha</a>
      </>
    )
  },
  {
    title: 'O que os países podem fazer para melhorar a proteção aos refugiados e imigrantes?',
    content: (
      <ul className="list-disc ml-6">
        <li>Garantir o direito ao asilo com processos acessíveis e transparentes</li>
        <li>Fortalecer políticas públicas inclusivas</li>
        <li>Oferecer documentação e acesso a serviços sociais</li>
        <li>Promover campanhas de combate à xenofobia</li>
        <li>Investir em programas de integração e empregabilidade</li>
        <li>Cooperar com ONGs e organismos internacionais</li>
      </ul>
    )
  },
  {
    title: 'Como posso ajudar refugiados e imigrantes mesmo sendo um cidadão comum?',
    content: (
      <>
        <ul className="list-disc ml-6">
          <li>Voluntariar-se em ONGs e instituições de apoio</li>
          <li>Oferecer doações (roupas, alimentos, materiais escolares)</li>
          <li>Apoiar financeiramente projetos e campanhas de acolhimento</li>
          <li>Compartilhar informações corretas e combater notícias falsas</li>
          <li>Participar de campanhas de conscientização e políticas de inclusão</li>
        </ul>
        🔗 <a href="https://www.acnur.org/br/ajude-os-refugiados/trabalhe-no-acnur" target="_blank" className="underline text-blue-600">Voluntariado</a>
      </>
    )
  },
  {
    title: 'Qual é a perspectiva futura para os refugiados no cenário global?',
    content: (
      <>
        Com o aumento de deslocamentos forçados por guerras, perseguições, crises ambientais e mudanças climáticas, é esperado que os fluxos migratórios cresçam. Contudo, há uma tendência de fortalecimento de políticas globais de proteção, integração e reassentamento.
      </>
    )
  }
];

const TrilhaDireitosHumanos: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-8 overflow-y-auto"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('/assets/images/direitoshumanos.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
      <h2 className="text-4xl font-bold text-[#ffde59] mb-6 mt-[9vh]">Direitos Humanos</h2>

      <div className="w-full max-w-4xl space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="bg-white text-black shadow-md rounded-xl border border-gray-200"
          >
            <button
              className="w-full text-left p-4 font-semibold text-lg"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {item.title}
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-base">{item.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrilhaDireitosHumanos;
