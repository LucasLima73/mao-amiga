/* eslint-disable @typescript-eslint/no-explicit-any */
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
import VerticalTimeline from "../utils/timeline";

interface Step {
  title: string;
  description: string;
  checklist: ChecklistItem[]; 
  order: number;
}

interface ChecklistItem {
  task: string;
  checked: boolean;
}

const TrilhaSaude: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);

    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);

    // Verificar se a mensagem já foi fechada
    const messageClosed = localStorage.getItem("messageClosed");
    if (messageClosed !== "true") {
      setShowMessage(true);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      const fetchSteps = async () => {
        try {
          const q = query(collection(db, "steps"), orderBy("order"));
          const querySnapshot = await getDocs(q);
      
          const fetchedSteps: Step[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              title: data.title || "Título Indefinido", // Garante um valor padrão
              description: data.description || "",
              order: data.order ?? 0,
              checklist: data.checklist
                ? data.checklist.map((task: any) => ({
                    task: task.task,
                    checked: task.checked || false,
                  }))
                : [],
            };
          });
      
          setSteps(fetchedSteps);
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      };      
      fetchSteps();
    }
  }, [isClient, userId]);
  
    

  const isStepCompleted = (stepIndex: number) => {
    const checklist = steps[stepIndex]?.checklist;
    return checklist ? checklist.every((task) => task.checked) : true;
  };

  const toggleCheckbox = (stepIndex: number, taskIndex: number) => {
    if (!userId) {
      setShowMessage(true); // Exibe a mensagem se o usuário não estiver logado
      return;
    }

    const updatedSteps = steps.map((step, sIndex) =>
      sIndex === stepIndex
        ? {
          ...step,
          checklist: step.checklist?.map((task, tIndex) =>
            tIndex === taskIndex ? { ...task, checked: !task.checked } : task
          ),
        }
        : step
    );
    setSteps(updatedSteps);

    if (
      updatedSteps[stepIndex].checklist &&
      updatedSteps[stepIndex].checklist!.every((task) => task.checked)
    ) {
      const nextStep = stepIndex + 1;
      if (nextStep < steps.length) {
        setActiveStep(nextStep);
      }
    }

    if (userId) {
      const progress_steps = updatedSteps.reduce((acc: any, step) => {
        acc[step.order] = step.checklist?.map((task) => ({
          checked: task.checked,
        }));
        return acc;
      }, {});

      const userRef = doc(db, "user_progress", userId);
      setDoc(
        userRef,
        {
          progress_steps: progress_steps,
        },
        { merge: true }
      );
    }
  };

  const handleCloseMessage = () => {
    localStorage.setItem("messageClosed", "true");
    setShowMessage(false);
  };

  if (!isClient) {
    return null;
  }

  return (
      <div
        style={{
          backgroundImage: "url('/assets/images/saude.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <div
          style={{
            marginTop: '100px',
          }}>
          <VerticalTimeline
            title="Trilha de Saúde"
            steps={steps}
            activeStep={activeStep}
            userId={userId}
            toggleCheckbox={toggleCheckbox}
          />
        </div>
        {showMessage && !userId && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold text-gray-800">Crie uma conta!</h2>
            <p className="text-sm text-gray-600">
              Para salvar seu progresso, crie uma conta!
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
  );
};

export default TrilhaSaude;
