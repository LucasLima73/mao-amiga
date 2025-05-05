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
import { usePathname } from "next/navigation";

interface Step {
  title: string;
  description: string;
  checklist?: { task: string; checked: boolean }[];
  order: number;
}

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
    <span className="ml-4 text-base whitespace-nowrap">
      Consultar Mapa
    </span>
  </a>
);

const TrilhaSaude: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [showHealthDocsPopup, setShowHealthDocsPopup] = useState(false);
  const [healthDocIndex, setHealthDocIndex] = useState(0);

  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) setUserId(localStorage.getItem("userId"));
  }, [isClient]);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const q = query(collection(db, "steps"), orderBy("order"));
        const snap = await getDocs(q);
        const fetched: Step[] = snap.docs.map((d) => d.data() as Step);

        if (userId) {
          const userSnap = await getDoc(doc(db, "user_progress", userId));
          if (userSnap.exists()) {
            const prog = userSnap.data().progress_steps || {};
            const updated = fetched.map((step) => ({
              ...step,
              checklist: step.checklist?.map((task, ti) => ({
                ...task,
                checked: prog[step.order]?.[ti]?.checked || false,
              })),
            }));
            setSteps(updated);
            return;
          }
        }
        setSteps(fetched);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };
    fetchSteps();
  }, [userId]);

  const handleStepClick = (i: number) => {
    if (i === 0) {
      setHealthDocIndex(0);
      setShowHealthDocsPopup(true);
    }
    setActiveStep(i);
  };
  const handleClosePopup = () => setShowHealthDocsPopup(false);

  return (
    <div
      key={pathname}
      className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center p-8"
      style={{
        backgroundImage: "url('/assets/images/saude.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="text-4xl font-bold text-[#ffde59] mb-6 mt-[9vh] text-center">
        Saúde
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

      {showHealthDocsPopup && (
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
                Documento – {healthDocData[healthDocIndex].title}
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
                onClick={() => setHealthDocIndex((i) => i - 1)}
                disabled={healthDocIndex === 0}
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
                  src={healthDocData[healthDocIndex].image}
                  alt={healthDocData[healthDocIndex].title}
                  className="w-full h-auto mb-4"
                />
                <p className="whitespace-pre-line text-base sm:text-lg">
                  {healthDocData[healthDocIndex].text}
                </p>
              </div>

              {/* Right arrow */}
              <button
                onClick={() => setHealthDocIndex((i) => i + 1)}
                disabled={healthDocIndex === healthDocData.length - 1}
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

export default TrilhaSaude;
