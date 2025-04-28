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

const trilhaDocumentacao = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedPath, setSelectedPath] = useState<number | null>(null);
  const { t } = useTranslation(); 

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
          {t("consultar_mapa")}
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

  const docData = [
    {
      title: t("cpf_title"),
      image: "/assets/images/cpf.png",
      text: t("cpf_text"),
    },
    {
      title: t("ctps_title"),
      image: "/assets/images/ctps.png",
      text: t("ctps_text"),
    },
  ];
  
  const thirdDocData = [
    {
      title: t("cadastro_unico_title"),
      image: "/assets/images/CadUnico.png",
      text: t("cadastro_unico_text"),
    },
    {
      title: t("bolsa_familia_title"),
      image: "/assets/images/bolsaFamilia.png",
      text: t("bolsa_familia_text"),
    },
    {
      title: t("cartao_sus_title"),
      image: "/assets/images/cartao-do-sus.png",
      text: t("cartao_sus_text"),
    },
  ];

  const [showPopup, setShowPopup] = useState(false); 
  const [showCPFPopup, setShowCPFPopup] = useState(false); 
  const [showThirdDocPopup, setShowThirdDocPopup] = useState(false);
  const [showRefugioPopup, setShowRefugioPopup] = useState(false);
  const [showResidenciaPopup, setShowResidenciaPopup] = useState(false);

  const [showCRNMBack, setShowCRNMBack] = useState(false);
  const [showDPRNMBack, setShowDPRNMBack] = useState(false);

  const [docIndex, setDocIndex] = useState(0);

  const [thirdDocIndex, setThirdDocIndex] = useState(0);
  const [showThirdDocBack, setShowThirdDocBack] = useState(false);

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
          console.log("Passos carregados:", fetchedSteps); // Log para depuração

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

  const handleRefugioClick = () => {
    setShowRefugioPopup(true);
  };

  const handleResidenciaClick = () => {
    setShowResidenciaPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowCPFPopup(false);
    setShowThirdDocPopup(false);
    setShowRefugioPopup(false);
    setShowResidenciaPopup(false);
    setShowCRNMBack(false);
    setShowDPRNMBack(false);
    setShowThirdDocBack(false);
  };

  const handleCRNMFlip = () => setShowCRNMBack(!showCRNMBack);
  const handleDPRNMFlip = () => setShowDPRNMBack(!showDPRNMBack);

  const pageTitle =
    selectedPath === 1
      ? t("page_title_refugio")
      : selectedPath === 2
      ? t("page_title_residencia")
      : t("page_title_documentacao");

  return (
    <div
      key={pathname}
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage: "url('/assets/images/documentacao.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Container responsivo - Layout Desktop */}
      <div className="hidden md:flex md:flex-col md:items-center md:justify-start md:pt-14 md:pb-20 md:px-2 md:w-full">
        <h2 className="text-3xl font-bold text-[#ffde59] mb-6 mt-4 text-center drop-shadow-lg">
          {pageTitle}
        </h2>

        {selectedPath === null ? (
          <div className="max-w-4xl bg-white p-4 rounded-sm shadow-md text-gray-800 mb-8">
            <h3 className="text-center text-2xl font-semibold mb-4">
              {t("caminhos_regularizacao_title")}
            </h3>
            <p className="mb-4">{t("caminhos_regularizacao_text")}</p>
            <p className="text-center mb-6">{t("principais_opcoes")}</p>
            <div className="flex gap-4 justify-center">
              <div className="group relative">
                <button
                  onClick={() => setSelectedPath(1)}
                  className="bg-[#e5b019] text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                  {t("solicitacao_refugio_button")}
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition bg-gray-200 text-gray-800 p-2 rounded-sm shadow-md text-sm w-72 z-10">
                  <p>{t("solicitacao_refugio_tooltip")}</p>
                </div>
              </div>

              <div className="group relative">
                <button
                  onClick={() => setSelectedPath(2)}
                  className="bg-[#e5b019] text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                  {t("autorizacao_residencia_button")}
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition bg-gray-200 text-gray-800 p-2 rounded-sm shadow-md text-sm w-72 z-10">
                  <p>{t("autorizacao_residencia_tooltip")}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => setSelectedPath(null)}
              className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2 text-lg font-medium"
            >
              ← {t("voltar")}
            </button>
            <div className="max-w-4xl bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              {isClient && (
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
                  showDocumentButton={false}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Layout Mobile */}
      <div className="md:hidden flex flex-col w-full h-full">
        <div className="bg-blue-600 text-white py-4 px-4 shadow-md fixed top-0 left-0 right-0 z-10">
          <h2 className="text-xl font-bold text-center">{pageTitle}</h2>
        </div>
        
        <div className="flex-1 pt-16 pb-20 px-3">
          {selectedPath === null ? (
            <>
              <div className="bg-yellow-50 rounded-lg p-3 mb-4 border-l-4 border-yellow-400 shadow-sm">
                <h3 className="text-sm font-medium text-yellow-800">{t("caminhos_regularizacao_title")}</h3>
                <p className="text-xs text-yellow-700 mt-1">{t("caminhos_regularizacao_text")}</p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setSelectedPath(1)}
                  className="bg-[#e5b019] text-white px-4 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition text-sm font-medium"
                >
                  {t("solicitacao_refugio_button")}
                </button>
                <button
                  onClick={() => setSelectedPath(2)}
                  className="bg-[#e5b019] text-white px-4 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition text-sm font-medium"
                >
                  {t("autorizacao_residencia_button")}
                </button>
              </div>

              <div className="mt-4 bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400 shadow-sm">
                <h3 className="text-sm font-medium text-blue-800">{t("dica")}</h3>
                <p className="text-xs text-blue-700 mt-1">{t("escolha_caminho_dica")}</p>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setSelectedPath(null)}
                className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm font-medium"
              >
                ← {t("voltar")}
              </button>

              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                {isClient && (
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
                    showDocumentButton={false}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mb-52 right-4">
        <MapaButton />
      </div>

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
              {t("clique_documento_verso")}
            </p>
            <div
              className="flex-1 flex flex-col items-center justify-center gap-24 w-full"
              style={{ perspective: "1000px" }}
            >
              <div
                className="w-[36rem] h-[22rem] relative cursor-pointer"
                style={{ perspective: "1000px" }}
                onClick={handleCRNMFlip}
              >
                <div
                  className={`absolute w-full h-full transition-transform duration-500 transform-style preserve-3d ${
                    showCRNMBack ? "rotate-y-180" : ""
                  }`}
                >
                  <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center bg-white p-4">
                    <h4 className="text-3xl font-semibold mb-4 text-black">
                      {t("crnm_frente")}
                    </h4>
                    <img
                      src="/assets/images/crnm.png"
                      alt={t("crnm_frente")}
                      className="w-full h-auto max-w-lg mb-4"
                    />
                    <p className="text-center text-xl text-black">
                      {t("clique_ver_verso")}
                    </p>
                  </div>
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex items-center bg-white p-4 -mt-4">
                    <div className="flex flex-row items-center justify-center w-full">
                      <img
                        src="/assets/images/verso-crnm.png"
                        alt={t("crnm_verso")}
                        className="w-1/2 h-auto max-w-lg mr-4"
                      />
                      <p className="text-center text-xl text-black px-2">
                        {t("crnm_verso_text")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="w-[36rem] h-[22rem] relative cursor-pointer"
                style={{ perspective: "1000px" }}
                onClick={handleDPRNMFlip}
              >
                <div
                  className={`absolute w-full h-full transition-transform duration-500 transform-style preserve-3d ${
                    showDPRNMBack ? "rotate-y-180" : ""
                  }`}
                >
                  <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center bg-white p-4">
                    <h4 className="text-3xl font-semibold mb-4 text-black">
                      {t("dprnm_frente")}
                    </h4>
                    <img
                      src="/assets/images/dprnm.png"
                      alt={t("dprnm_frente")}
                      className="w-full h-auto max-w-lg mb-4"
                    />
                    <p className="text-center text-xl text-black">
                      {t("clique_ver_verso")}
                    </p>
                  </div>
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex items-center bg-white p-4 -mt-4">
                    <div className="flex flex-row items-center justify-center w-full">
                      <img
                        src="/assets/images/verso-dprnm.png"
                        alt={t("dprnm_verso")}
                        className="w-1/2 h-auto max-w-lg mr-4"
                      />
                      <p className="text-center text-xl text-black px-2">
                        {t("dprnm_verso_text")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              {t("documento")} - {docData[docIndex].title}
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

      {showRefugioPopup && (
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
              {t("solicitacao_refugio_title")}
            </p>
            <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full px-4">
              <div className="max-w-4xl bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-2xl font-semibold mb-4 text-black text-center">
                  {t("solicitacao_refugio_subtitle")}
                </h4>
                <div className="space-y-4 text-black">
                  <p className="text-lg">{t("solicitacao_refugio_desc")}</p>
                  <div className="mt-6">
                    <h5 className="text-xl font-semibold mb-3">{t("documentos_necessarios")}:</h5>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>{t("documento_identificacao")}</li>
                      <li>{t("comprovante_entrada")}</li>
                      <li>{t("fotos_3x4")}</li>
                      <li>{t("formulario_preenchido")}</li>
                    </ul>
                  </div>
                  <div className="mt-6">
                    <h5 className="text-xl font-semibold mb-3">{t("onde_solicitar")}:</h5>
                    <p>{t("local_solicitacao_refugio")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showResidenciaPopup && (
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
              {t("autorizacao_residencia_title")}
            </p>
            <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full px-4">
              <div className="max-w-4xl bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-2xl font-semibold mb-4 text-black text-center">
                  {t("autorizacao_residencia_subtitle")}
                </h4>
                <div className="space-y-4 text-black">
                  <p className="text-lg">{t("autorizacao_residencia_desc")}</p>
                  <div className="mt-6">
                    <h5 className="text-xl font-semibold mb-3">{t("documentos_necessarios")}:</h5>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>{t("documento_identificacao")}</li>
                      <li>{t("comprovante_residencia")}</li>
                      <li>{t("declaracao_endereco")}</li>
                      <li>{t("certidao_antecedentes")}</li>
                      <li>{t("taxa_pagamento")}</li>
                    </ul>
                  </div>
                  <div className="mt-6">
                    <h5 className="text-xl font-semibold mb-3">{t("onde_solicitar")}:</h5>
                    <p>{t("local_solicitacao_residencia")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              {t("documento")} - {thirdDocData[thirdDocIndex].title}
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

export default trilhaDocumentacao;