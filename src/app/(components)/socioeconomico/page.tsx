"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import Timeline from "../utils/timeline";

interface Step {
  title: string;
  description: string;
  checklist?: { task: string; checked: boolean }[];
  order: number;
}

const socioeconomico: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Efeito para atualizar o userId (ex.: ao fazer login)
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  // Efeito para buscar os passos sempre que o userId for atualizado
  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const q = query(collection(db, "steps"), orderBy("order"));
        const querySnapshot = await getDocs(q);
        const fetchedSteps: Step[] = querySnapshot.docs.map((doc) => doc.data() as Step);

        // Se houver um usuário logado, tenta buscar o progresso e mesclar com os passos
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
        // Caso não haja userId ou progresso, define os passos padrões
        setSteps(fetchedSteps);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchSteps();
  }, [userId]); // A dependência aqui faz com que a busca seja refeita quando o userId muda

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-8"
        style={{
          backgroundImage: "url('/assets/images/saude.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
      <h2 className="text-4xl font-bold text-[#ffde59] mb-6  mt-[9vh]">Documentação</h2>
      <Timeline 
        steps={steps} 
        activeStep={activeStep} 
        setActiveStep={setActiveStep} 
        userId={userId} 
      />
    </div>
  );
};

export default socioeconomico;
