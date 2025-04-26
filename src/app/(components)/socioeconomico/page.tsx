"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";
import Timeline from "../utils/timeline";

interface Step {
  title: string;
  description: string;
  checklist?: { task: string; checked: boolean }[];
  order: number;
}

// Dados do carrossel do primeiro passo (CPF, Cartão SUS, etc.)
const healthDocData = [
  {
    title: "CPF (Cadastro de Pessoa Física)",
    image: "/assets/images/cpf.png",
    text: `O CPF é um número de identificação emitido pela Receita Federal. É fundamental para:
• Abrir conta bancária e obter serviços financeiros.
• Realizar compras online e emitir notas fiscais.
• Acessar programas sociais e benefícios do governo.
• Emitir outros documentos (CNH, passaporte).
Em resumo, o CPF é indispensável para viver legalmente no Brasil.`,
  },
  {
    title: "Cartão SUS",
    image: "/assets/images/cartao-do-sus.png",
    text: "O Cartão SUS assegura o acesso aos serviços de saúde pública.",
  },
  {
    title: "Cadastro Único",
    image: "/assets/images/CadUnico.png",
    text: "O Cadastro Único identifica e caracteriza famílias de baixa renda, sendo essencial para o acesso a programas sociais.",
  },
];

// Botão "Consultar Mapa" com design responsivo
const MapaButton: React.FC = () => (
  <>
    {/* Versão desktop do botão */}
    <a
      href="/mapa"
      className="
        hidden md:inline-flex
        fixed
        top-4
        right-4
        group
        items-center
        h-14
        w-14
        bg-blue-600
        text-white
        rounded-full
        transition-all
        duration-300
        hover:w-48
        hover:bg-blue-700
        overflow-hidden
        z-20
        shadow-lg
      "
    >
      <div className="flex items-center justify-center w-14 h-14">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <span className="ml-2 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">
        Consultar Mapa
      </span>
    </a>
    
    {/* Versão mobile do botão - Flutuante no canto inferior */}
    <a
      href="/mapa"
      className="
        md:hidden
        fixed
        bottom-4
        right-4
        flex
        items-center
        justify-center
        h-14
        w-14
        bg-blue-600
        text-white
        rounded-full
        z-20
        shadow-lg
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </a>
  </>
);

const socioeconomico: React.FC = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Força remount ao navegar
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    }
  }, [isClient]);

  // Busca "steps" no Firestore
  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const q = query(collection(db, "steps"), orderBy("order"));
        const querySnapshot = await getDocs(q);
        const fetchedSteps: Step[] = querySnapshot.docs.map((doc) => doc.data() as Step);

        if (userId) {
          const userRef = doc(db, "user_progress", userId);
          const userSnapshot = await getDoc(userRef);
          if (userSnapshot.exists()) {
            const userProgress = userSnapshot.data()?.progress_steps;
            if (userProgress) {
              const updatedSteps = fetchedSteps.map((step) => ({
                ...step,
                checklist: step.checklist?.map((task, taskIndex) => ({
                  ...task,
                  checked: userProgress[step.order]?.[taskIndex]?.checked || false,
                })),
              }));
              setSteps(updatedSteps);
              return;
            }
          }
        }
        setSteps(fetchedSteps);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchSteps();
  }, [userId]);

  return (
    <div
      key={pathname}
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage: "url('/assets/images/saude.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Container responsivo - Layout Desktop mantido igual ao original */}
      <div className="hidden md:flex md:flex-col md:items-center md:justify-start md:pt-14 md:pb-20 md:px-2 md:w-full">
        {/* Título "Saúde" com cores mais vivas */}
        <h2 className="text-3xl font-bold text-[#ffde59] mb-6 mt-4 text-center drop-shadow-lg">
          {t("socioeconomico_title")}
        </h2>

        {/* Container principal */}
        <div className="w-full max-w-md mx-auto mb-4">
          {/* Card branco com conteúdo principal */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
            {/* Cabeçalho do card */}
            <div className="bg-blue-600 text-white py-3 px-4">
              <h3 className="text-lg font-bold">{t("trilha_socioeconomico_title")}</h3>
            </div>
            
            {/* Conteúdo principal */}
            <div className="p-4">
              {isClient && (
                <Timeline
                  steps={steps}
                  activeStep={activeStep}
                  setActiveStep={setActiveStep}
                  userId={userId}
                  showDocumentButton={false}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* NOVO LAYOUT MOBILE - visível apenas em telas pequenas */}
      <div className="md:hidden flex flex-col w-full h-full">
        {/* Cabeçalho simplificado para mobile */}
        <div className="bg-blue-600 mt-16 text-white py-4 px-4 shadow-md fixed top-0 left-0 right-0 z-10">
          <h2 className="text-xl font-bold text-center">{t("socioeconomico_title")}</h2>
        </div>
        
        {/* Espaço para o conteúdo principal - com padding superior para acomodar o cabeçalho fixo */}
        <div className="flex-1 pt-16 pb-20 px-3">
          {/* Seção de informação superior */}
          <div className="mt-16 bg-yellow-50 rounded-lg p-3 mb-4 border-l-4 border-yellow-400 shadow-sm">
            <h3 className="text-sm font-medium text-yellow-800">{t("trilha_socioeconomico_title")}</h3>
            <p className="text-xs text-yellow-700 mt-1">
              {t("trilha_socioeconomico_desc")}
            </p>
          </div>
          
          {/* Card principal com a timeline */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            {isClient && (
              <Timeline
                steps={steps}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                userId={userId}
                showDocumentButton={false}
              />
            )}
          </div>
          
          {/* Dicas adicionais para mobile */}
          <div className="mt-4 bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400 shadow-sm">
            <h3 className="text-sm font-medium text-blue-800">{t("dica_title")}</h3>
            <p className="text-xs text-blue-700 mt-1">
              {t("dica_desc")}
            </p>
          </div>
        </div>
      </div>

      {/* Botão "Consultar Mapa" fixo na tela */}
      <div className=" mb-52 right-4">
        <MapaButton />
      </div>
    </div>
  );
};

export default socioeconomico;