"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
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
        fixed top-4 right-4
        group items-center
        h-14 w-14
        bg-blue-600 text-white
        rounded-full
        transition-all duration-300
        hover:w-48 hover:bg-blue-700
        overflow-hidden z-20 shadow-lg
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

    {/* Versão mobile do botão */}
    <a
      href="/mapa"
      className="
        md:hidden
        fixed bottom-4 right-4
        flex items-center justify-center
        h-14 w-14
        bg-blue-600 text-white
        rounded-full z-20 shadow-lg
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

const TrilhaSaude: React.FC = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  // Estados de navegação
  const [activeStep, setActiveStep] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // **Novos estados para o popup de documentos**
  const [showHealthDocsPopup, setShowHealthDocsPopup] = useState<boolean>(false);
  const [healthDocIndex, setHealthDocIndex] = useState<number>(0);

  // força remount ao navegar
  useEffect(() => {
    setIsClient(true);
  }, []);

  // carrega userId do localStorage
  useEffect(() => {
    if (isClient) {
      setUserId(localStorage.getItem("userId"));
    }
  }, [isClient]);

  // busca passos no Firestore
  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const q = query(collection(db, "steps"), orderBy("order"));
        const snap = await getDocs(q);
        const fetched: Step[] = snap.docs.map(d => d.data() as Step);

        if (userId) {
          const userRef = doc(db, "user_progress", userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const prog = userSnap.data()?.progress_steps_saude;
            if (prog) {
              const updated = fetched.map(step => ({
                ...step,
                checklist: step.checklist?.map((task, idx) => ({
                  ...task,
                  checked: prog[step.order]?.[idx]?.checked || false,
                })),
              }));
              setSteps(updated);
              return;
            }
          }
        }
        setSteps(fetched);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };

    fetchSteps();
  }, [userId]);

  // quando clica em um passo
  const handleStepClick = (index: number) => {
    if (index === 0) {
      setHealthDocIndex(0);
      setShowHealthDocsPopup(true);
    }
    setActiveStep(index);
  };

  // fecha o popup
  const handleClosePopup = () => {
    setShowHealthDocsPopup(false);
  };

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
      {/* Layout desktop */}
      <div className="hidden md:flex flex-col items-center justify-start pt-14 pb-20 px-2 w-full">
        <h2 className="text-3xl font-bold text-[#ffde59] mb-6 mt-4 text-center drop-shadow-lg">
          {t("navbar.health")}
        </h2>

        <div className="relative max-w-4xl w-full mb-8 overflow-visible">
          <MapaButton />

          <div className="bg-white pt-16 p-4 rounded-sm shadow-md text-gray-800">
            <Timeline
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              userId={userId}
              onStepClick={handleStepClick}
              showDocumentButton
              hideDocumentButtonForSteps={[1]}
            />
          </div>
        </div>

        {/* Popup do primeiro passo */}
        {showHealthDocsPopup && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={handleClosePopup}
          >
            <div
              className="bg-white p-4 rounded-sm shadow-lg relative max-w-6xl w-full min-h-[90vh] overflow-y-auto flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={handleClosePopup}
                className="absolute top-3 right-3 text-4xl font-bold text-red-600 hover:text-red-700"
              >
                X
              </button>
              <p className="text-2xl font-bold text-center mb-4 mt-4 text-black">
                Documento – {healthDocData[healthDocIndex].title}
              </p>
              <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full px-4 relative">
                <div className="max-w-xl bg-white p-4 rounded-md shadow-md flex flex-col items-center">
                  <h4 className="text-2xl font-semibold mb-4 text-black">
                    {healthDocData[healthDocIndex].title}
                  </h4>
                  <img
                    src={healthDocData[healthDocIndex].image}
                    alt={healthDocData[healthDocIndex].title}
                    className="w-full h-auto mb-4"
                  />
                  <p className="text-center text-lg whitespace-pre-line text-black">
                    {healthDocData[healthDocIndex].text}
                  </p>
                </div>
                {healthDocIndex > 0 && (
                  <button
                    onClick={() =>
                      setHealthDocIndex(i => Math.max(i - 1, 0))
                    }
                    className="absolute top-1/2 transform -translate-y-1/2 text-8xl text-blue-600 hover:text-blue-800 z-10 left-8"
                  >
                    {"<"}
                  </button>
                )}
                {healthDocIndex < healthDocData.length - 1 && (
                  <button
                    onClick={() =>
                      setHealthDocIndex(i => Math.min(i + 1, healthDocData.length - 1))
                    }
                    className="absolute top-1/2 transform -translate-y-1/2 text-8xl text-blue-600 hover:text-blue-800 z-10 right-8"
                  >
                    {">"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Botão fixo para mapa (após conteúdo) */}
        <div className="mb-52 right-4">
          <MapaButton />
        </div>
      </div>
    </div>
  );
};

export default TrilhaSaude;
