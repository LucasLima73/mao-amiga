"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc as firestoreDoc,
  getDoc,
} from "firebase/firestore";
import Timeline from "@/app/(components)/utils/timeline";
import { usePathname } from "next/navigation";

interface Step {
  title: string;
  description: string;
  checklist?: { task: string; checked: boolean }[];
  order: number;
}

// Botão "Consultar Mapa" sempre aberto
const MapaButton: React.FC = () => (
  <a
    href="/mapa"
    className="
      absolute top-4 right-4
      inline-flex items-center
      h-16 w-56
      bg-blue-600 text-white
      rounded-full
      overflow-hidden
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
    <span className="ml-4 text-base opacity-100 whitespace-nowrap">
      Consultar Mapa
    </span>
  </a>
);


const TrilhaSocioeconomica: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setUserId(localStorage.getItem("userId"));
    }
  }, [isClient]);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const q = query(collection(db, "socioeconomico-pt"), orderBy("order"));
        const fetchedSteps: Step[] = (await getDocs(q)).docs.map((d) => d.data() as Step);

        if (userId) {
          const userSnapshot = await getDoc(firestoreDoc(db, "user_progress", userId));
          const userProgress = userSnapshot.data()?.progress_steps;
          if (userProgress) {
            const updated = fetchedSteps.map((step) => ({
              ...step,
              checklist: step.checklist?.map((task, idx) => ({
                ...task,
                checked: userProgress[step.order]?.[idx]?.checked || false,
              })),
            }));
            setSteps(updated);
            return;
          }
        }
        setSteps(fetchedSteps);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };

    fetchSteps();
  }, [userId]);

  const handleStepClick = (idx: number) => {
    setActiveStep(idx);
  };

  return (
    <div
      key={pathname}
      className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center p-8"
      style={{
        backgroundImage: "url('/assets/images/apoio-financeiro.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="text-4xl font-bold text-[#ffde59] mb-6 mt-[9vh] text-center">
        Apoio Socioeconômico
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
          />
        </div>
      </div>
    </div>
  );
};

export default TrilhaSocioeconomica;
