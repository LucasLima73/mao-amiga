"use client";

// versão mesclada final
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import Timeline from "../utils/timeline";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

interface Step {
  title: string;
  description: string;
  checklist?: { task: string; checked: boolean }[];
  order: number;
}

// Dados para os popups (carrossel de documentos)
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
    text: `A CTPS é o documento que registra oficialmente o histórico profissional do trabalhador no Brasil.
• É utilizada para contratos de trabalho com carteira assinada.
• Garante acesso a direitos como FGTS, INSS, férias, 13º salário e seguro-desemprego.
• Pode ser emitida na versão física ou digital.
A CTPS é essencial para comprovar vínculos empregatícios e acessar benefícios trabalhistas.`,
  },
];

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
    text: "O Cartão SUS assegura o acesso aos serviços de saúde pública.",
  },
];

// Botão "Consultar Mapa" – posicionado no canto superior direito
const MapaButton: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="absolute top-4 right-4 z-10">
      <a
        href="/mapa"
        className="group inline-flex items-center h-16 w-16 bg-blue-600 text-white rounded-full transition-all duration-300 hover:w-56 hover:bg-blue-700 overflow-hidden"
      >
        <div className="flex items-center justify-center w-16 h-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
            />
          </svg>
        </div>
        <span className="whitespace-nowrap pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {t('trilhaDocumentacao.consultarMapa')}
        </span>
      </a>
    </div>
  );
};

const TrilhaDocumentacao: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedPath, setSelectedPath] = useState<number | null>(null);
  const [language, setLanguage] = useState(i18n.language)

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      console.log('Language changed to:', lng);
      setLanguage(lng);
    }
  
    i18n.on('languageChanged', handleLanguageChange)
  
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])
  
  // Force a refresh of data when language changes
  useEffect(() => {
    console.log('Language state changed to:', language);
    if (selectedPath !== null) {
      console.log('Forcing data refresh due to language change');
      // This will trigger the fetchSteps useEffect
      setSelectedPath(selectedPath);
    }
  }, [language, selectedPath])
  

  // Popups
  const [showPopup, setShowPopup] = useState(false); // CRNM/DPRNM
  const [showCPFPopup, setShowCPFPopup] = useState(false); // CPF/CTPS
  const [showThirdDocPopup, setShowThirdDocPopup] = useState(false); // Terceiro documento

  // Flip states para CRNM/DPRNM
  const [showCRNMBack, setShowCRNMBack] = useState(false);
  const [showDPRNMBack, setShowDPRNMBack] = useState(false);

  // Para CPF/CTPS
  const [docIndex, setDocIndex] = useState(0);

  // Para terceiro passo
  const [thirdDocIndex, setThirdDocIndex] = useState(0);
  const [showThirdDocBack, setShowThirdDocBack] = useState(false);

  const pathname = usePathname();

  // Marca que estamos no client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    }
  }, [isClient]);

  // Define a progressKey de acordo com o caminho selecionado:
  // "progress_steps_refugio" para Solicitação de Refúgio e "progress_steps_residencia" para Autorização de Residência.
  const progressKey =
    selectedPath === 1
      ? "progress_steps_refugio"
      : selectedPath === 2
      ? "progress_steps_residencia"
      : "progress_steps";

  // Busca dos passos no Firestore (baseado em selectedPath)
  useEffect(() => {
    console.log('fetchSteps useEffect triggered - language:', i18n.language, 'selectedPath:', selectedPath);
    if (selectedPath !== null) {
      const fetchSteps = async () => {
        try {
          let collectionName = "steps-en-doc-autorizaresidencia";
          if (selectedPath === 2) {
            // For authorization residence path
            if (i18n.language === "pt") {
              collectionName = "stepsDocumentacao-autorizacaoResidencia"
            } else if (i18n.language === "en") {
              collectionName = "ssteps-en-doc-autorizaresidencia";
            } else if (i18n.language === "es") {
              collectionName = "steps- es-doc-autorizacaoresidencia";
            } else {
              collectionName = "steps-en-doc-autorizaresidencia";
            }
          } else {
            // For regular documentation path
            if (i18n.language === "pt") {
              collectionName = "stepsDocumentacao";
            } else if (i18n.language === "en") {
              collectionName = "stepsDocumentacao - en";
            } else if (i18n.language === "es") {
              collectionName = "stepsDocumenetacao - es";
            } else {
              collectionName = "stepsDocumentacao - en";
            }
          }
          console.log('Current language:', i18n.language);
          console.log('Using collection:', collectionName);
          const q = query(collection(db, collectionName), orderBy("order"));
          const querySnapshot = await getDocs(q);
          const fetchedSteps: Step[] = querySnapshot.docs.map(
            (doc) => doc.data() as Step
          );

          if (userId) {
            const userRef = doc(db, "user_progress", userId);
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
              // Usa a progressKey correta ao buscar o progresso
              const userProgress = userSnapshot.data()?.[progressKey];
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
  }, [userId, selectedPath, progressKey, language, i18n.language]);

  // Handlers para abrir popups
  const handleFirstStepClick = () => {
    setShowPopup(true); // Abre popup de CRNM/DPRNM
  };
  const handleSecondStepClick = () => {
    setDocIndex(0);
    setShowCPFPopup(true); // Abre popup de CPF/CTPS
  };
  const handleThirdStepClick = () => {
    setThirdDocIndex(0);
    setShowThirdDocBack(false);
    setShowThirdDocPopup(true); // Abre popup do terceiro documento
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
      ? t('documentation.pageTitle.refuge')
      : selectedPath === 2
      ? t('documentation.pageTitle.residence')
      : t('documentation.pageTitle.main');

  return (
    <div
      key={pathname}
      className="min-h-screen w-screen flex flex-col items-center justify-center p-8"
      style={{
        backgroundImage: "url('/assets/images/documentacao.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Título principal */}
      <h2 className="text-4xl font-bold text-[#ffde59] mb-6 mt-[9vh]">
        {pageTitle}
      </h2>

      {selectedPath === null && (
        <div className="max-w-5xl mx-auto px-4 py-8 bg-white rounded-lg shadow-lg relative">
        <MapaButton />
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          {t('trilhaDocumentacao.caminhos')}
        </h1>
        <p className="text-lg text-center mb-8">
          {t('trilhaDocumentacao.descricaoCaminhos')}
        </p>

        <h2 className="text-xl font-semibold mb-4 text-center">
          {t('trilhaDocumentacao.principaisOpcoes')}
        </h2>  
        <div className="flex gap-4 justify-center">
            <div className="group relative">
              <button
                onClick={() => setSelectedPath(1)}
                className="bg-[#e5b019] text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              >
                {t('trilhaDocumentacao.solicitacaoRefugio')}
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition bg-gray-200 text-gray-800 p-2 rounded-sm shadow-md text-sm w-72 z-10">
                <p>
                  <strong>{t('trilhaDocumentacao.solicitacaoRefugio')}</strong>
                  <br />
                  {t('trilhaDocumentacao.descricaoRefugio')}
                </p>
              </div>
            </div>

            <div className="group relative">
              <button
                onClick={() => setSelectedPath(2)}
                className="bg-[#e5b019] text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              >
                {t('trilhaDocumentacao.autorizacaoResidencia')}
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition bg-gray-200 text-gray-800 p-2 rounded-sm shadow-md text-sm w-72 z-10">
                <p>
                  <strong>{t('trilhaDocumentacao.autorizacaoResidencia')}</strong>
                  <br />
                  {t('trilhaDocumentacao.descricaoResidencia')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPath === 1 && (
        <div className="relative max-w-4xl bg-white p-4 rounded-sm shadow-md text-gray-800 w-full mb-8 overflow-visible">
          <button
            onClick={() => setSelectedPath(null)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Voltar
          </button>
          <MapaButton />
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
            progressKey={progressKey}
          />
        </div>
      )}

      {selectedPath === 2 && (
        <div className="relative max-w-4xl bg-white p-4 rounded-sm shadow-md text-gray-800 w-full mb-8 overflow-visible">
          <button
            onClick={() => setSelectedPath(null)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Voltar
          </button>
          <MapaButton />
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
            progressKey={progressKey}
          />
        </div>
      )}

      {/* Popup 1: CRNM / DPRNM */}
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
              onClick={handleClosePopup}
              className="absolute top-3 right-3 text-4xl font-bold text-red-600 hover:text-red-700"
            >
              X
            </button>
            <p className="text-2xl font-bold text-center mb-8 mt-4 text-black">
              {t('trilhaDocumentacao.cliqueDocumento')}
            </p>
            <div
              className="flex-1 flex flex-col items-center justify-center gap-24 w-full"
              style={{ perspective: "1000px" }}
            >
              {/* CRNM */}
              <div
                className="w-[36rem] h-[22rem] relative cursor-pointer"
                style={{ perspective: "1000px" }}
                onClick={handleCRNMFlip}
              >
                <div
                  className={`absolute w-full h-full transition-transform duration-500 transform-style preserve-3d ${showCRNMBack ? "rotate-y-180" : ""
                    }`}
                >
                  {/* Frente CRNM */}
                  <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center bg-white p-4">
                    <h4 className="text-3xl font-semibold mb-4 text-black">
                      {t('trilhaDocumentacao.crnmFrente')}
                    </h4>
                    <img
                      src="/assets/images/crnm.png"
                      alt={t('trilhaDocumentacao.crnmFrente')}
                      className="w-full h-auto max-w-lg mb-4"
                    />
                    <p className="text-center text-xl text-black">
                      {t('trilhaDocumentacao.cliqueVerVerso')}
                    </p>
                  </div>
                  {/* Verso CRNM */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex items-center bg-white p-4 -mt-4">
                    <div className="flex flex-row items-center justify-center w-full">
                      <img
                        src="/assets/images/verso-crnm.png"
                        alt={`${t('trilhaDocumentacao.crnmFrente')} - ${t('trilhaDocumentacao.versoCartaoSUS')}`}
                        className="w-1/2 h-auto max-w-lg mr-4"
                      />
                      <p className="text-center text-xl text-black px-2">
                        <strong>{t('trilhaDocumentacao.crnmTitulo')}</strong>
                        <br />
                        {t('trilhaDocumentacao.crnmDescricao')}
                        <br />
                        {t('trilhaDocumentacao.cliqueVoltar')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DPRNM */}
              <div
                className="w-[36rem] h-[22rem] relative cursor-pointer"
                style={{ perspective: "1000px" }}
                onClick={handleDPRNMFlip}
              >
                <div
                  className={`absolute w-full h-full transition-transform duration-500 transform-style preserve-3d ${showDPRNMBack ? "rotate-y-180" : ""
                    }`}
                >
                  {/* Frente DPRNM */}
                  <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center bg-white p-4">
                    <h4 className="text-3xl font-semibold mb-4 text-black">
                      {t('trilhaDocumentacao.dprnmFrente')}
                    </h4>
                    <img
                      src="/assets/images/dprnm.png"
                      alt={t('trilhaDocumentacao.dprnmFrente')}
                      className="w-full h-auto max-w-lg mb-4"
                    />
                    <p className="text-center text-xl text-black">
                      {t('trilhaDocumentacao.cliqueVerVerso')}
                    </p>
                  </div>
                  {/* Verso DPRNM */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex items-center bg-white p-4 -mt-4">
                    <div className="flex flex-row items-center justify-center w-full">
                      <img
                        src="/assets/images/verso-dprnm.png"
                        alt={`${t('trilhaDocumentacao.dprnmFrente')} - ${t('trilhaDocumentacao.versoCartaoSUS')}`}
                        className="w-1/2 h-auto max-w-lg mr-4"
                      />
                      <p className="text-center text-xl text-black px-2">
                        <strong>{t('trilhaDocumentacao.dprnmTitulo')}</strong>
                        <br />
                        {t('trilhaDocumentacao.dprnmDescricao')}
                        <br />
                        {t('trilhaDocumentacao.cliqueVoltar')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup 2: CPF / CTPS */}
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
              onClick={handleClosePopup}
              className="absolute top-3 right-3 text-4xl font-bold text-red-600 hover:text-red-700"
            >
              X
            </button>
            <p className="text-2xl font-bold text-center mb-4 mt-4 text-black">
              {t('trilhaDocumentacao.documento')} {docData[docIndex].title}
            </p>
            <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full px-4">
              <div className="max-w-xl bg-white p-4 rounded-md shadow-md flex flex-col items-center">
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
                className={`absolute top-1/2 transform -translate-y-1/2 text-8xl text-blue-600 hover:text-blue-800 z-10 ${docIndex === 0 ? "right-8" : "left-8"}`}
              >
                {docIndex === 0 ? ">" : "<"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup 3: Cadastro Único, Bolsa Família, Cartão SUS */}
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
              onClick={handleClosePopup}
              className="absolute top-3 right-3 text-4xl font-bold text-red-600 hover:text-red-700"
            >
              X
            </button>
            <p className="text-2xl font-bold text-center mb-4 mt-4 text-black">
              {t('trilhaDocumentacao.documento')} {thirdDocData[thirdDocIndex].title}
            </p>
            <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full px-4 relative">
              <div className="max-w-xl bg-white p-4 rounded-md shadow-md flex flex-col items-center">
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
                          ? t('trilhaDocumentacao.versoCartaoSUS')
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
