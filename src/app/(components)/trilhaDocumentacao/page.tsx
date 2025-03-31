"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import Timeline from "../utils/timeline";

interface Step {
  title: string;
  description: string;
  checklist?: { task: string; checked: boolean }[];
  order: number;
}

const TrilhaDocumentacao: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedPath, setSelectedPath] = useState<number | null>(null);

  // Estados para popups
  const [showPopup, setShowPopup] = useState(false); // CRNM/DPRNM
  const [showCPFPopup, setShowCPFPopup] = useState(false); // CPF/CTPS
  const [showThirdDocPopup, setShowThirdDocPopup] = useState(false); // Terceiro documento
  const [showCRNMBack, setShowCRNMBack] = useState(false);
  const [showDPRNMBack, setShowDPRNMBack] = useState(false);

  // Para CPF/CTPS
  const [docIndex, setDocIndex] = useState(0);

  // Para terceiro passo (Cadastro Único, Bolsa Família, Cartão SUS)
  const [thirdDocIndex, setThirdDocIndex] = useState(0);
  const [showThirdDocBack, setShowThirdDocBack] = useState(false);

  // Dados para CPF/CTPS
  const docData = [
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
      title: "CTPS (Carteira de Trabalho e Previdência Social)",
      image: "/assets/images/ctps.png",
      text: `A CTPS (Carteira de Trabalho e Previdência Social) é o documento que registra oficialmente o histórico profissional do trabalhador no Brasil.
• É utilizada para contratos de trabalho com carteira assinada.
• Garante acesso a direitos como FGTS, INSS, férias, 13º salário e seguro-desemprego.
• Pode ser emitida na versão física ou digital.
A CTPS é essencial para comprovar vínculos empregatícios e acessar benefícios trabalhistas.`,
    },
  ];

  // Dados para o Terceiro Passo
  const thirdDocData = [
    {
      title: "Cadastro Único",
      image: "/assets/images/CadUnico.png",
      text: "O Cadastro Único identifica e caracteriza famílias de baixa renda, sendo essencial para o acesso a programas sociais.",
    },
    {
      title: "Bolsa Família",
      image: "/assets/images/bolsaFamilia.png",
      text: "O Bolsa Família é um programa de transferência de renda que beneficia famílias em situação de vulnerabilidade, garantindo acesso a direitos fundamentais.",
    },
    {
      title: "Cartão SUS",
      image: "/assets/images/cartao-do-sus.png",
      text: "O Cartão SUS assegura o acesso aos serviços de saúde pública. Clique na imagem para ver o verso.",
    },
  ];

  // Marca que estamos no client (evita problemas com SSR)
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    }
  }, [isClient]);

  // Busca dos passos no Firestore com base no selectedPath
  useEffect(() => {
    if (selectedPath !== null) {
      const fetchSteps = async () => {
        try {
          const collectionName =
            selectedPath === 2
              ? "stepsDocumentacao-autorizacaoResidencia"
              : "stepsDocumentacao";
          const q = query(collection(db, collectionName), orderBy("order"));
          const querySnapshot = await getDocs(q);
          const fetchedSteps: Step[] = querySnapshot.docs.map(
            (doc) => doc.data() as Step
          );

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
                    checked:
                      userProgress[step.order]?.[taskIndex]?.checked || false,
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
    }
  }, [userId, selectedPath]);

  // Handlers para abertura dos popups
  const handleFirstStepClick = () => {
    setShowPopup(true); // Abre o popup de CRNM/DPRNM
  };
  const handleSecondStepClick = () => {
    setDocIndex(0);
    setShowCPFPopup(true); // Abre o popup de CPF/CTPS
  };
  const handleThirdStepClick = () => {
    setThirdDocIndex(0);
    setShowThirdDocBack(false);
    setShowThirdDocPopup(true); // Abre o popup do terceiro documento
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowCPFPopup(false);
    setShowThirdDocPopup(false);
    setShowCRNMBack(false);
    setShowDPRNMBack(false);
    setShowThirdDocBack(false);
  };

  const handleCRNMFlip = () => setShowCRNMBack(!showCRNMBack);
  const handleDPRNMFlip = () => setShowDPRNMBack(!showDPRNMBack);

  const pageTitle =
    selectedPath === 1
      ? "Documentação - Solicitação de Refúgio"
      : selectedPath === 2
        ? "Documentação - Autorização de Residência"
        : "Documentação";

  // Botão "Consultar Mapa" padronizado para todas as trilhas
  const MapaButton = () => (
    <div className="absolute top-4 right-4 z-10">
      <a
        href="/mapa"
        className="
          group inline-flex items-center
          h-16 w-16
          bg-blue-600 text-white
          rounded-full
          transition-all duration-300
          hover:w-56 hover:bg-blue-700
          overflow-hidden
        "
      >
        <div className="flex items-center justify-center w-16 h-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
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
        <span
          className="
            ml-4
            text-base
            opacity-0
            group-hover:opacity-100
            transition-opacity duration-300
            whitespace-nowrap
          "
        >
          Consultar Mapa
        </span>
      </a>
    </div>
  );

  return (
    <div
      className="min-h-screen w-screen flex flex-col items-center justify-center p-8"
      style={{
        backgroundImage: "url('/assets/images/documentacao.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="text-4xl font-bold text-[#ffde59] mb-6 mt-[9vh]">
        {pageTitle}
      </h2>

      {selectedPath === null && (
        <div className="max-w-4xl bg-white p-4 rounded-sm shadow-md text-gray-800 mb-8">
          <h3 className="text-center text-2xl font-semibold mb-4">
            Caminhos para Regularização Migratória no Brasil
          </h3>
          <p className="mb-4">
            Ao chegar ao Brasil, imigrantes e refugiados podem regularizar sua situação
            legal de diferentes maneiras, dependendo de cada caso.
          </p>
          <p className="text-center mb-6">Principais opções:</p>
          <div className="flex gap-4 justify-center">
            <div className="group relative">
              <button
                onClick={() => setSelectedPath(1)}
                className="bg-[#e5b019] text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              >
                Solicitação de Refúgio
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition bg-gray-200 text-gray-800 p-2 rounded-sm shadow-md text-sm w-72 z-10">
                <p>
                  <strong>Refúgio:</strong> Para quem fugiu de perseguição, guerra ou crises
                  humanitárias, garantindo proteção internacional enquanto o pedido é analisado.
                </p>
              </div>
            </div>

            <div className="group relative">
              <button
                onClick={() => setSelectedPath(2)}
                className="bg-[#e5b019] text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              >
                Autorização de Residência
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition bg-gray-200 text-gray-800 p-2 rounded-sm shadow-md text-sm w-72 z-10">
                <p>
                  <strong>Residência:</strong> Para quem deseja viver e trabalhar legalmente no Brasil,
                  via vínculos familiares, emprego ou acordos internacionais.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPath === 1 && (
        <div className="relative max-w-4xl bg-white p-4 rounded-sm shadow-md text-gray-800 w-full mb-8 overflow-visible">
          {/* Botão de Voltar no canto esquerdo */}
          <button
            onClick={() => setSelectedPath(null)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Voltar
          </button>
          {/* Botão "Consultar Mapa" padronizado */}
          <MapaButton />
          <Timeline
            steps={steps}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            userId={userId}
            onStepClick={(index) => {
              if (index === 0) {
                handleFirstStepClick(); // Abre popup de CRNM/DPRNM
              } else if (index === 1) {
                handleSecondStepClick(); // Abre popup de CPF/CTPS
              } else if (index === 2) {
                handleThirdStepClick(); // Abre popup do terceiro documento
              }
            }}
            showDocumentButton
          />
        </div>
      )}

      {selectedPath === 2 && (
        <div className="relative max-w-4xl bg-white p-4 rounded-sm shadow-md text-gray-800 w-full mb-8 overflow-visible">
          {/* Botão de Voltar no canto esquerdo */}
          <button
            onClick={() => setSelectedPath(null)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Voltar
          </button>
          {/* Botão "Consultar Mapa" padronizado */}
          <MapaButton />
          <Timeline
            steps={steps}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            userId={userId}
            onStepClick={(index) => {
              // Comportamento de clique para Autorização de Residência, se necessário
            }}
            showDocumentButton
            hideFirstStepDocButton={true}
          />
        </div>
      )}

      {/* Popup do primeiro passo: CRNM / DPRNM */}
      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleClosePopup}
        >
          <div
            className="bg-white p-4 rounded-sm shadow-lg relative max-w-6xl w-full min-h-[90vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-4xl font-bold text-red-600 hover:text-red-700"
              onClick={handleClosePopup}
            >
              X
            </button>
            <p className="text-2xl font-bold text-center mb-8 w-full mt-4 text-black">
              Clique no documento para ver o verso e o descritivo
            </p>

            {/* Container com perspectiva para efeito de flip */}
            <div
              className="flex-1 flex flex-col items-center justify-center gap-24 w-full"
              style={{ perspective: "1000px" }}
            >
              {/* CRNM */}
              <div onClick={handleCRNMFlip} className="cursor-pointer relative w-full max-w-md h-auto">
                <div
                  className={`relative w-full transition-transform duration-500 transform-style preserve-3d ${showCRNMBack ? "rotate-y-180" : ""
                    }`}
                >
                  {/* Frente */}
                  <div className="w-full backface-hidden flex flex-col items-center justify-center bg-white p-4">
                    <h4 className="text-2xl font-semibold mb-4 text-black">CRNM</h4>
                    <img
                      src="/assets/images/crnm.png"
                      alt="CRNM Frente"
                      className="w-full h-auto max-w-lg mb-4 scale-100"
                    />
                  </div>

                  {/* Verso */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center bg-white p-4">
                    <img
                      src="/assets/images/verso-crnm.png"
                      alt="CRNM Verso"
                      className="w-full h-auto max-w-lg mb-4 scale-100"
                    />
                    <p className="text-center text-lg text-black p-[10px]">
                      <strong>CRNM (Carteira de Registro Nacional Migratório):</strong><br />
                      Documento definitivo para imigrantes com autorização de residência ou refúgio reconhecido.
                    </p>
                  </div>
                </div>
              </div>

              {/* DPRNM */}
              <div onClick={handleDPRNMFlip} className="cursor-pointer relative w-full max-w-md h-auto">
                <div
                  className={`relative w-full transition-transform duration-500 transform-style preserve-3d ${showDPRNMBack ? "rotate-y-180" : ""
                    }`}
                >
                  {/* Frente */}
                  <div className="w-full backface-hidden flex flex-col items-center justify-center bg-white p-4">
                    <h4 className="text-2xl font-semibold mb-4 text-black">DPRNM</h4>
                    <img
                      src="/assets/images/dprnm.png"
                      alt="DPRNM Frente"
                      className="w-full h-auto max-w-lg mb-4"
                    />
                  </div>

                  {/* Verso */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center bg-white p-4">
                    <img
                      src="/assets/images/verso-dprnm.png"
                      alt="DPRNM Verso"
                      className="w-full h-auto max-w-lg mb-4"
                    />
                    <p className="text-center text-lg text-black p-[10px]">
                      <strong>DPRNM (Documento Provisório de Registro Nacional Migratório):</strong><br />
                      Documento temporário para solicitantes de refúgio, renovável anualmente até a decisão final.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup do segundo passo: CPF / CTPS */}
      {showCPFPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleClosePopup}
        >
          <div
            className="bg-white p-4 rounded-sm shadow-lg relative max-w-6xl w-full min-h-[90vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-4xl font-bold text-red-600 hover:text-red-700"
              onClick={handleClosePopup}
            >
              X
            </button>
            <p className="text-2xl font-bold text-center mb-4 w-full mt-4 text-black">
              Documento - {docData[docIndex].title}
            </p>
            <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full px-4">
              <div className="max-w-xl bg-white p-4 rounded-md shadow-md flex flex-col items-center relative">
                <h4 className="text-2xl font-semibold mb-4 text-black">
                  {docData[docIndex].title}
                </h4>
                <img
                  src={docData[docIndex].image}
                  alt={docData[docIndex].title}
                  className="w-full h-auto mb-4"
                />
                <p className="text-center text-lg whitespace-pre-line text-black">
                  {docData[docIndex].text}
                </p>
              </div>
              <button
                onClick={() => setDocIndex((prev) => (prev === 0 ? 1 : 0))}
                className={`absolute top-1/2 transform -translate-y-1/2 text-8xl text-blue-600 hover:text-blue-800 z-10 ${docIndex === 0 ? "right-8" : "left-8"
                  }`}
              >
                {docIndex === 0 ? ">" : "<"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup do terceiro passo: Terceiro Documento */}
      {showThirdDocPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleClosePopup}
        >
          <div
            className="bg-white p-4 rounded-sm shadow-lg relative max-w-6xl w-full min-h-[90vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-4xl font-bold text-red-600 hover:text-red-700"
              onClick={handleClosePopup}
            >
              X
            </button>
            <p className="text-2xl font-bold text-center mb-4 w-full mt-4 text-black">
              Documento - {thirdDocData[thirdDocIndex].title}
            </p>
            <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full px-4 relative">
              <div className="max-w-xl bg-white p-4 rounded-md shadow-md flex flex-col items-center relative">
                <h4 className="text-2xl font-semibold mb-4 text-black">
                  {thirdDocData[thirdDocIndex].title}
                </h4>
                {thirdDocIndex === 2 ? (
                  <div
                    onClick={() => setShowThirdDocBack(!showThirdDocBack)}
                    className="cursor-pointer"
                  >
                    <img
                      src={
                        showThirdDocBack
                          ? "/assets/images/verso-cartao-sus.png"
                          : thirdDocData[thirdDocIndex].image
                      }
                      alt={
                        showThirdDocBack
                          ? "Verso Cartão SUS"
                          : thirdDocData[thirdDocIndex].title
                      }
                      className="w-full h-auto mb-4"
                    />
                  </div>
                ) : (
                  <img
                    src={thirdDocData[thirdDocIndex].image}
                    alt={thirdDocData[thirdDocIndex].title}
                    className="w-full h-auto mb-4"
                  />
                )}
                <p className="text-center text-lg whitespace-pre-line text-black">
                  {thirdDocData[thirdDocIndex].text}
                </p>
              </div>
              {thirdDocIndex === 0 && (
                <button
                  onClick={() => setThirdDocIndex(1)}
                  className="absolute top-1/2 transform -translate-y-1/2 text-8xl text-blue-600 hover:text-blue-800 z-10 right-8"
                >
                  {">"}
                </button>
              )}
              {thirdDocIndex === 1 && (
                <>
                  <button
                    onClick={() => setThirdDocIndex(0)}
                    className="absolute top-1/2 transform -translate-y-1/2 text-8xl text-blue-600 hover:text-blue-800 z-10 left-8"
                  >
                    {"<"}
                  </button>
                  <button
                    onClick={() => setThirdDocIndex(2)}
                    className="absolute top-1/2 transform -translate-y-1/2 text-8xl text-blue-600 hover:text-blue-800 z-10 right-8"
                  >
                    {">"}
                  </button>
                </>
              )}
              {thirdDocIndex === 2 && (
                <button
                  onClick={() => {
                    setThirdDocIndex(1);
                    setShowThirdDocBack(false);
                  }}
                  className="absolute top-1/2 transform -translate-y-1/2 text-8xl text-blue-600 hover:text-blue-800 z-10 left-8"
                >
                  {"<"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrilhaDocumentacao;
