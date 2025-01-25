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

interface Step {
  title: string;
  description: string;
  checklist?: { task: string; checked: boolean }[];
  order: number;
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
          const fetchedSteps: Step[] = querySnapshot.docs.map(
            (doc) => doc.data() as Step
          );
          setSteps(fetchedSteps);

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
              }
            }
          }
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl">
        {steps.length === 0 ? (
          <div>Carregando passos...</div>
        ) : (
          steps.map((step, index) => (
            <div key={index} className="relative flex mb-10 last:mb-0">
              {index !== steps.length - 1 && (
                <div
                  className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-300"
                  style={{
                    top: "2rem",
                    bottom: "-2rem",
                  }}
                />
              )}

              <div className="relative flex items-center">
                <button
                  onClick={() => {
                    if (index === 0 || isStepCompleted(index - 1)) {
                      setActiveStep(index);
                    }
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    isStepCompleted(index)
                      ? "bg-green-500 text-white border-green-500"
                      : activeStep === index
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-400 border-gray-300"
                  }`}
                  disabled={!isStepCompleted(index - 1) && index !== 0}
                >
                  {isStepCompleted(index) ? "✓" : ""}
                </button>
              </div>

              <div className="flex-1 ml-6">
                <div
                  className={`p-4 w-full rounded-md ${
                    isStepCompleted(index)
                      ? "bg-green-50 border border-green-500"
                      : activeStep === index
                      ? "bg-blue-50 border border-blue-500"
                      : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-bold ${
                      isStepCompleted(index)
                        ? "text-green-600"
                        : activeStep === index
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>

                {activeStep === index && step.checklist && (
                  <div className="mt-4 p-4 border border-gray-300 rounded-md bg-white">
                    {step.checklist.map((task, taskIndex) => (
                      <div key={taskIndex} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={task.checked}
                          onChange={() => toggleCheckbox(index, taskIndex)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{task.task}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
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
