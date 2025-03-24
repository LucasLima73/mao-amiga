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
import dynamic from "next/dynamic";

// Importa dinamicamente o componente do mapa, sem SSR
const GoogleMapComponent = dynamic(
  () => import("@/app/(components)/utils/googleMap"),
  { ssr: false }
);

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
  const [showPopup, setShowPopup] = useState(false);
  const [showCPFPopup, setShowCPFPopup] = useState(false);
  const [showThirdDocPopup, setShowThirdDocPopup] = useState(false);
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

  // Busca dos passos no Firestore
  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const q = query(collection(db, "stepsDocumentacao"), orderBy("order"));
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
  }, [userId]);

  // Handlers para abertura dos popups
  const handleFirstStepClick = () => {
    setShowPopup(true);
  };
  const handleSecondStepClick = () => {
    setDocIndex(0);
    setShowCPFPopup(true);
  };
  const handleThirdStepClick = () => {
    setThirdDocIndex(0);
    setShowThirdDocBack(false);
    setShowThirdDocPopup(true);
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

  // Título dinâmico da página
  const pageTitle =
    selectedPath === 1
      ? "Documentação - Solicitação de Refúgio"
      : selectedPath === 2
      ? "Documentação - Autorização de Residência"
      : "Documentação";

  // Estado para colapsar/expandir o bloco do mapa
  const [mapCollapsed, setMapCollapsed] = useState(false);

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

      {/* Tela de seleção */}
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
            {/* Botão Solicitação de Refúgio com tooltip */}
            <div className="group relative">
              <button
                onClick={() => setSelectedPath(1)}
                className="bg-[#e5b019] text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              >
                Solicitação de Refúgio
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition bg-gray-200 text-gray-800 p-2 rounded-sm shadow-md text-sm w-72 z-10">
                <p>
                  <strong>Refúgio:</strong> Para quem fugiu de perseguição, guerra ou crises
                  humanitárias, garantindo proteção internacional enquanto o pedido é analisado.
                </p>
              </div>
            </div>

            {/* Botão Autorização de Residência com tooltip */}
            <div className="group relative">
              <button
                onClick={() => setSelectedPath(2)}
                className="bg-[#e5b019] text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              >
                Autorização de Residência
              </button>
              {/* Tooltip */}
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

      {/* Caminho 1: Solicitação de Refúgio */}
      {selectedPath === 1 && (
        <>
          <div className="relative max-w-4xl bg-white p-4 rounded-sm shadow-md text-gray-800 w-full mb-8">
            <button
              onClick={() => setSelectedPath(null)}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Voltar
            </button>
            <Timeline
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              userId={userId}
              onStepClick={(index) => {
                if (index === 0) {
                  handleFirstStepClick();
                } else if (index === 1) {
                  handleSecondStepClick();
                } else if (index === 2) {
                  handleThirdStepClick();
                }
              }}
              showDocumentButton
            />
          </div>

          {/* Bloco branco do mapa com toggle */}
          <div className="relative max-w-6xl w-full bg-white p-4 rounded-md shadow-md mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold text-black">
                Mapa de Serviços Próximos
              </h3>
              <button
                className="text-3xl text-black"
                onClick={() => setMapCollapsed(!mapCollapsed)}
              >
                {mapCollapsed ? "▼" : "▲"}
              </button>
            </div>
            <div
              style={{
                height: mapCollapsed ? "0px" : "50vh",
                overflow: mapCollapsed ? "hidden" : "visible",
                transition: "height 0.3s ease",
              }}
            >
              {/* Componente dinâmico do mapa */}
              <GoogleMapComponent />
            </div>
          </div>
        </>
      )}

      {/* Autorização de Residência */}
      {selectedPath === 2 && (
        <div className="relative max-w-4xl bg-white p-4 rounded-sm shadow-md text-gray-800 w-full mb-8">
          <button
            onClick={() => setSelectedPath(null)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Voltar
          </button>
          <p className="text-center mb-4">
            Para pessoas que desejam viver e trabalhar legalmente no Brasil. Em breve, mais informações.
          </p>
          <div className="text-center text-lg font-semibold text-gray-600">Em breve...</div>
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
            <div className="flex-1 flex flex-col items-center justify-center gap-24 w-full">
              {/* CRNM */}
              <div
                className="w-[36rem] h-[22rem] relative cursor-pointer perspective"
                onClick={handleCRNMFlip}
              >
                <div
                  className={`absolute w-full h-full transition-transform duration-500 transform-style preserve-3d ${
                    showCRNMBack ? "rotate-y-180" : ""
                  }`}
                >
                  <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center bg-white p-4">
                    <h4 className="text-3xl font-semibold mb-4 text-black">CRNM</h4>
                    <img
                      src="/assets/images/crnm.png"
                      alt="CRNM Frente"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center bg-white rotate-y-180 p-4">
                    <img
                      src="/assets/images/verso-crnm.png"
                      alt="CRNM Verso"
                      className="w-full h-auto"
                    />
                    <p className="text-center px-2 text-xl mt-4 text-black">
                      <strong>CRNM (Carteira de Registro Nacional Migratório):</strong>{" "}
                      Documento definitivo para imigrantes com autorização de residência ou refúgio reconhecido.
                    </p>
                  </div>
                </div>
              </div>

              {/* DPRNM */}
              <div
                className="w-[36rem] h-[22rem] relative cursor-pointer perspective"
                onClick={handleDPRNMFlip}
              >
                <div
                  className={`absolute w-full h-full transition-transform duration-500 transform-style preserve-3d ${
                    showDPRNMBack ? "rotate-y-180" : ""
                  }`}
                >
                  <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center bg-white p-4">
                    <h4 className="text-3xl font-semibold mb-4 text-black">DPRNM</h4>
                    <img
                      src="/assets/images/dprnm.png"
                      alt="DPRNM Frente"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center bg-white rotate-y-180 p-4">
                    <img
                      src="/assets/images/verso-dprnm.png"
                      alt="DPRNM Verso"
                      className="w-full h-auto"
                    />
                    <p className="text-center px-2 text-xl mt-4 text-black">
                      <strong>DPRNM (Documento Provisório de Registro Nacional Migratório):</strong>{" "}
                      Documento temporário para solicitantes de refúgio, renovável anualmente até a decisão final.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup do segundo passo: CPF/CTPS */}
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
                className={`absolute top-1/2 transform -translate-y-1/2 text-8xl text-blue-600 hover:text-blue-800 z-10 ${
                  docIndex === 0 ? "right-8" : "left-8"
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

              {/* Botões de navegação do carrossel de documentos */}
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
