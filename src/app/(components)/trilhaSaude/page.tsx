"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";

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

// Botão "Consultar Mapa" com cores mais vibrantes
const MapaButton: React.FC = () => (
  <a
    href="/mapa"
    className="
      fixed
      top-4
      right-4
      group
      inline-flex
      items-center
      h-12
      w-12
      md:h-14
      md:w-14
      bg-blue-600
      text-white
      rounded-full
      transition-all
      duration-300
      hover:w-40
      md:hover:w-48
      hover:bg-blue-700
      overflow-hidden
      z-20
      shadow-lg
    "
  >
    <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14">
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
    <span className="ml-2 text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">
      Consultar Mapa
    </span>
  </a>
);

// Custom Timeline Component - Redesigned with enhanced contrast
const CustomTimeline: React.FC<{
  steps: Step[];
  activeStep: number;
  onStepClick: (index: number) => void;
  showDocumentButton: boolean;
  hideDocumentButtonForSteps?: number[];
}> = ({ steps, activeStep, onStepClick, showDocumentButton, hideDocumentButtonForSteps = [] }) => {
  if (steps.length === 0) return <div className="text-center py-4 text-black font-medium">Carregando...</div>;

  return (
    <div className="w-full">
      {steps.map((step, index) => (
        <div 
          key={index} 
          className={`mb-6 ${index === activeStep ? "opacity-100" : "opacity-90"}`}
        >
          <div 
            className={`
              flex items-start cursor-pointer
              ${index === activeStep ? "bg-blue-50 p-3 rounded-lg" : ""}
            `}
            onClick={() => onStepClick(index)}
          >
            {/* Circle indicator with number */}
            <div className={`
              flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md
              ${index === activeStep ? "bg-blue-700" : "bg-blue-500"}
            `}>
              {index + 1}
            </div>
            
            {/* Step content */}
            <div className="ml-4 flex-grow">
              <div className="flex flex-wrap justify-between items-start">
                <h3 className={`
                  text-lg font-bold
                  ${index === activeStep ? "text-blue-800" : "text-gray-800"}
                `}>
                  {step.title}
                </h3>
                
                {/* Document Button */}
                {showDocumentButton && 
                 !hideDocumentButtonForSteps.includes(index) && 
                 index === activeStep && (
                  <button 
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm mt-1 md:mt-0 font-medium shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStepClick(index);
                    }}
                  >
                    Ver Documento
                  </button>
                )}
              </div>
              
              <p className="text-sm text-gray-800 mt-1 font-medium">{step.description}</p>
              
              {/* Checklist items if present */}
              {step.checklist && step.checklist.length > 0 && index === activeStep && (
                <div className="mt-3 pl-1">
                  {step.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        readOnly
                        className="mr-2 h-5 w-5 accent-blue-600"
                      />
                      <span className="text-sm text-gray-800 font-medium">{item.task}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Connecting line except for last item */}
          {index < steps.length - 1 && (
            <div className="ml-6 h-8 border-l-4 border-blue-400"></div>
          )}
        </div>
      ))}
    </div>
  );
};

const TrilhaSaude: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Popup do primeiro passo
  const [showHealthDocsPopup, setShowHealthDocsPopup] = useState(false);
  const [healthDocIndex, setHealthDocIndex] = useState(0);

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

  // Ao clicar no passo 0, abre popup
  const handleStepClick = (index: number) => {
    if (index === 0) {
      // Abre popup do primeiro passo
      setHealthDocIndex(0);
      setShowHealthDocsPopup(true);
    }
    setActiveStep(index);
  };

  const handleClosePopup = () => {
    setShowHealthDocsPopup(false);
  };

  return (
    <div
      key={pathname}
      className="min-h-screen w-full flex flex-col items-center justify-start pt-14 pb-20 px-2"
      style={{
        backgroundImage: "url('/assets/images/saude.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Título "Saúde" com cores mais vivas */}
      <h2 className="text-2xl md:text-3xl font-bold text-[#ffde59] mb-6 mt-4 text-center drop-shadow-lg">
        Saúde
      </h2>

      {/* Botão "Consultar Mapa" fixo na tela */}
      <MapaButton />

      {/* Container principal */}
      <div className="w-full max-w-md mx-auto mb-4">
        {/* Card branco com conteúdo principal */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          {/* Cabeçalho do card */}
          <div className="bg-blue-600 text-white py-3 px-4">
            <h3 className="text-lg font-bold">Trilha de Documentos</h3>
          </div>
          
          {/* Conteúdo principal */}
          <div className="p-4">
            <CustomTimeline
              steps={steps}
              activeStep={activeStep}
              onStepClick={handleStepClick}
              showDocumentButton={true}
              hideDocumentButtonForSteps={[1]}
            />
          </div>
        </div>
      </div>

      {/* Popup do primeiro passo */}
      {showHealthDocsPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-30 p-2"
          onClick={handleClosePopup}
        >
          <div
            className="bg-white rounded-lg shadow-xl relative w-full max-w-sm md:max-w-lg max-h-[90vh] overflow-y-auto border border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do popup */}
            <div className="bg-blue-600 text-white py-3 px-4 rounded-t-lg">
              <h3 className="text-lg font-bold text-center pr-8">
                {healthDocData[healthDocIndex].title}
              </h3>
            </div>
            
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-xl font-bold text-white hover:text-red-200 w-8 h-8 flex items-center justify-center"
            >
              X
            </button>
            
            <div className="p-4">
              <div className="mb-4">
                <img
                  src={healthDocData[healthDocIndex].image}
                  alt={healthDocData[healthDocIndex].title}
                  className="w-full max-w-xs mx-auto h-auto mb-4 border border-gray-300 rounded-lg shadow-md"
                />
                <p className="text-sm md:text-base whitespace-pre-line text-gray-800 font-medium">
                  {healthDocData[healthDocIndex].text}
                </p>
              </div>
              
              {/* Navegação do carrossel */}
              <div className="flex justify-between items-center mt-6 border-t pt-4 border-gray-200">
                <button
                  onClick={() => healthDocIndex > 0 && setHealthDocIndex(healthDocIndex - 1)}
                  className={`px-4 py-2 rounded-md ${
                    healthDocIndex > 0 ? 'bg-blue-600 text-white font-medium shadow-md' : 'bg-gray-200 text-gray-500'
                  }`}
                  disabled={healthDocIndex === 0}
                >
                  Anterior
                </button>
                <span className="text-sm font-bold text-gray-700">
                  {healthDocIndex + 1} de {healthDocData.length}
                </span>
                <button
                  onClick={() => 
                    healthDocIndex < healthDocData.length - 1 && 
                    setHealthDocIndex(healthDocIndex + 1)
                  }
                  className={`px-4 py-2 rounded-md ${
                    healthDocIndex < healthDocData.length - 1 
                      ? 'bg-blue-600 text-white font-medium shadow-md' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  disabled={healthDocIndex === healthDocData.length - 1}
                >
                  Próximo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Barra de navegação inferior fixa */}
      <div className="fixed bottom-0 left-0 right-0 bg-white flex justify-around items-center py-3 shadow-lg z-10 border-t border-gray-300">
        <a href="/edu" className="flex flex-col items-center text-xs text-gray-700 font-medium">
          <span className="text-xl">🎓</span>
          <span>EDU</span>
        </a>
        <a href="/doc" className="flex flex-col items-center text-xs text-blue-700 font-bold">
          <span className="text-xl">📄</span>
          <span>DOC</span>
        </a>
        <a href="/direitos" className="flex flex-col items-center text-xs text-gray-700 font-medium">
          <span className="text-xl">⚖️</span>
          <span>DIREITOS</span>
        </a>
        <a href="/socio" className="flex flex-col items-center text-xs text-gray-700 font-medium">
          <span className="text-xl">👥</span>
          <span>SOCIO</span>
        </a>
        <a href="/mais" className="flex flex-col items-center text-xs text-gray-700 font-medium">
          <span className="text-xl">⋯</span>
          <span>MAIS</span>
        </a>
      </div>
    </div>
  );
};

export default TrilhaSaude;