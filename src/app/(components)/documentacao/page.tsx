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
    <a
      href="/mapa"
      className="
        absolute top-4 right-4
        inline-flex items-center
        h-16 w-56
        bg-blue-600 text-white
        rounded-full
        transition-colors duration-200
        hover:bg-blue-800
        z-10
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
      <span className="ml-4 text-base whitespace-nowrap">Consultar Mapa</span>
    </a>
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
      ? t("page_title_refugio")
      : selectedPath === 2
      ? t("page_title_residencia")
      : t("page_title_documentacao");

  return (
    <div
      key={pathname}
      className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center p-8"
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
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition bg-gray-200 text-gray-800 p-2 rounded-sm shadow-md text-sm w-44 sm:w-56 md:w-72 z-10">
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
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition bg-gray-200 text-gray-800 p-2 rounded-sm shadow-md text-sm w-44 sm:w-56 md:w-72 z-10">
                <p>{t("autorizacao_residencia_tooltip")}</p>
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
          />
        </div>
      )}

      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
          onClick={handleClosePopup}
        >
          <div
            className="
        relative
        w-full
        sm:max-w-lg
        lg:max-w-2xl
        max-h-[calc(100vh-2rem)]
        bg-white
        rounded-lg
        shadow-lg
        overflow-hidden
        flex flex-col
      "
            onClick={(e) => e.stopPropagation()}
          >
            {/* botão fechar */}
            <button
              onClick={handleClosePopup}
              className="absolute top-3 right-3 text-4xl font-bold text-red-600 hover:text-red-700 z-10"
            >
              X
            </button>

            {/* título */}
            <div className="px-6 pt-6 pb-2">
              <p className="text-2xl font-bold text-center text-black">
                {t("clique_documento_verso")}
              </p>
            </div>

            {/* corpo rolável */}
            <div
              className="
          flex-1
          overflow-y-auto
          px-6 pb-6
          space-y-10
        "
              style={{ perspective: "1000px" }}
            >
              {/* --- CRNM (Frente & Verso) --- */}
              <div
                className="w-full max-w-md h-[22rem] mx-auto cursor-pointer"
                onClick={handleCRNMFlip}
                style={{ perspective: "1000px" }}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-500 transform-style preserve-3d ${
                    showCRNMBack ? "rotate-y-180" : ""
                  }`}
                >
                  {/* frente CRNM */}
                  <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center bg-white p-4">
                    <h4 className="text-3xl font-semibold mb-4 text-black">
                      {t("crnm_frente")}
                    </h4>
                    <img
                      src="/assets/images/crnm.png"
                      alt={t("crnm_frente")}
                      className="w-full h-auto max-w-lg mb-4"
                    />
                    {/* <p className="text-center text-xl text-black">
                      {t("clique_ver_verso")}
                    </p> */}
                  </div>

                  {/* verso CRNM */}
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

              {/* --- DPRNM (Frente & Verso) --- */}
              <div
                className="w-full max-w-md h-[22rem] mx-auto cursor-pointer"
                onClick={handleDPRNMFlip}
                style={{ perspective: "1000px" }}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-500 transform-style preserve-3d ${
                    showDPRNMBack ? "rotate-y-180" : ""
                  }`}
                >
                  {/* frente DPRNM */}
                  <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center bg-white p-4">
                    <h4 className="text-3xl font-semibold mb-4 text-black">
                      {t("dprnm_frente")}
                    </h4>
                    <img
                      src="/assets/images/dprnm.png"
                      alt={t("dprnm_frente")}
                      className="w-full h-auto max-w-lg mb-4"
                    />
                    {/* <p className="text-center text-xl text-black">
                      {t("clique_ver_verso")}
                    </p> */}
                  </div>

                  {/* verso DPRNM */}
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
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
          onClick={handleClosePopup}
        >
          <div
            className="
            relative
            w-full
            sm:max-w-lg
            lg:max-w-2xl
            max-h-[calc(100vh-2rem)]
            bg-white
            rounded-lg
            shadow-lg
            overflow-visible
            flex flex-col
          "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header sticky */}
            <div className="sticky top-0 bg-white z-20 flex items-center justify-between p-4 border-b">
              <h3 className="text-2xl font-bold flex-1 text-center text-black">
                Documento – {docData[docIndex].title}
              </h3>
              <button
                onClick={handleClosePopup}
                className="ml-2 text-3xl font-bold text-red-600 hover:text-red-700"
              >
                ×
              </button>
            </div>

            {/* Body scrollable */}
            <div className="relative flex-1 overflow-y-auto px-6 py-8 flex items-center justify-center">
              {/* Left arrow */}
              <button
                onClick={() => setDocIndex((i) => i - 1)}
                disabled={docIndex === 0}
                className="
                  absolute
                  left-4
                  top-1/2
                  transform -translate-y-1/2
                  text-4xl sm:text-5xl
                  text-blue-600 hover:text-blue-800
                  disabled:opacity-50
                "
              >
                ‹
              </button>

              {/* Conteúdo do card */}
              <div className="bg-white p-6 rounded-md shadow-md max-w-xl text-center text-black">
                <img
                  src={docData[docIndex].image}
                  alt={docData[docIndex].title}
                  className="w-full h-auto mb-4"
                />
                <p className="whitespace-pre-line text-base sm:text-lg">
                  {docData[docIndex].text}
                </p>
              </div>

              {/* Right arrow */}
              <button
                onClick={() => setDocIndex((i) => i + 1)}
                disabled={docIndex === docData.length - 1}
                className="
                  absolute
                  right-4
                  top-1/2
                  transform -translate-y-1/2
                  text-4xl sm:text-5xl
                  text-blue-600 hover:text-blue-800
                  disabled:opacity-50
                "
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      {showThirdDocPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
          onClick={handleClosePopup}
        >
          <div
            className="
            relative
            w-full
            sm:max-w-lg
            lg:max-w-2xl
            max-h-[calc(100vh-2rem)]
            bg-white
            rounded-lg
            shadow-lg
            overflow-visible
            flex flex-col
          "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header sticky */}
            <div className="sticky top-0 bg-white z-20 flex items-center justify-between p-4 border-b">
              <h3 className="text-2xl font-bold flex-1 text-center text-black">
                Documento – {thirdDocData[thirdDocIndex].title}
              </h3>
              <button
                onClick={handleClosePopup}
                className="ml-2 text-3xl font-bold text-red-600 hover:text-red-700"
              >
                ×
              </button>
            </div>

            {/* Body scrollable */}
            <div className="relative flex-1 overflow-y-auto px-6 py-8 flex items-center justify-center">
              {/* Left arrow */}
              <button
                onClick={() => setThirdDocIndex((i) => i - 1)}
                disabled={thirdDocIndex === 0}
                className="
                  absolute
                  left-4
                  top-1/2
                  transform -translate-y-1/2
                  text-4xl sm:text-5xl
                  text-blue-600 hover:text-blue-800
                  disabled:opacity-50
                "
              >
                ‹
              </button>

              {/* Conteúdo do card */}
              <div className="bg-white p-6 rounded-md shadow-md max-w-xl text-center text-black">
                <img
                  src={thirdDocData[thirdDocIndex].image}
                  alt={thirdDocData[thirdDocIndex].title}
                  className="w-full h-auto mb-4"
                />
                <p className="whitespace-pre-line text-base sm:text-lg">
                  {thirdDocData[thirdDocIndex].text}
                </p>
              </div>

              {/* Right arrow */}
              <button
                onClick={() => setThirdDocIndex((i) => i + 1)}
                disabled={thirdDocIndex === thirdDocData.length - 1}
                className="
                  absolute
                  right-4
                  top-1/2
                  transform -translate-y-1/2
                  text-4xl sm:text-5xl
                  text-blue-600 hover:text-blue-800
                  disabled:opacity-50
                "
              >
                ›
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default trilhaDocumentacao;
