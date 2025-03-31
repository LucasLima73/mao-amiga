"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Step {
  title: string;
  description: string;
  checklist?: { task: string; checked: boolean }[];
  order: number;
}

interface TimelineProps {
  steps: Step[];
  activeStep: number;
  setActiveStep: (step: number) => void;
  userId: string | null;
  onStepClick?: (index: number) => void;
  showDocumentButton?: boolean;
  // Nova propriedade para ocultar o botão no primeiro passo
  hideFirstStepDocButton?: boolean;
}

interface LineStyle {
  top: number;
  height: number;
  left: number;
}

// Função para transformar URLs em links clicáveis
function makeLinksClickable(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return (text || "").replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" class="text-blue-500 underline">${url}</a>`;
  });
}

const Timeline: React.FC<TimelineProps> = ({
  steps,
  activeStep,
  setActiveStep,
  userId,
  onStepClick,
  showDocumentButton = false,
  hideFirstStepDocButton = false,
}) => {
  const [localSteps, setLocalSteps] = useState<Step[]>(steps);

  useEffect(() => {
    setLocalSteps(steps);
  }, [steps]);

  const isStepCompleted = (stepIndex: number): boolean => {
    const checklist = localSteps[stepIndex]?.checklist;
    return checklist ? checklist.every((task) => task.checked) : true;
  };

  const [expandedSteps, setExpandedSteps] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (localSteps.length > 0) {
      let newActiveStep = localSteps.findIndex((_, index) => !isStepCompleted(index));
      if (newActiveStep === -1) {
        newActiveStep = localSteps.length - 1;
      }
      if (newActiveStep !== activeStep) {
        setActiveStep(newActiveStep);
      }
      const initialExpanded: { [key: number]: boolean } = {};
      localSteps.forEach((_, index) => {
        initialExpanded[index] = index === newActiveStep;
      });
      setExpandedSteps(initialExpanded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSteps]);

  const containerRef = useRef<HTMLDivElement>(null);
  const firstCircleRef = useRef<HTMLDivElement>(null);
  const lastCircleRef = useRef<HTMLDivElement>(null);

  const [lineStyle, setLineStyle] = useState<LineStyle>({
    top: 0,
    height: 0,
    left: 0,
  });

  const recalcLineStyle = useCallback(() => {
    if (containerRef.current && firstCircleRef.current && lastCircleRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const firstRect = firstCircleRef.current.getBoundingClientRect();
      const lastRect = lastCircleRef.current.getBoundingClientRect();

      const top = firstRect.top - containerRect.top + firstRect.height / 2;
      const bottom = lastRect.bottom - containerRect.top - lastRect.height / 2;
      const height = bottom - top;
      const left = firstRect.left - containerRect.left + firstRect.width / 2;
      setLineStyle({ top, height, left });
    }
  }, []);

  useEffect(() => {
    recalcLineStyle();
    window.addEventListener("resize", recalcLineStyle);
    return () => window.removeEventListener("resize", recalcLineStyle);
  }, [localSteps, activeStep, expandedSteps, recalcLineStyle]);

  const toggleCheckbox = async (stepIndex: number, taskIndex: number) => {
    if (!userId) {
      alert("Você precisa estar logado para salvar seu progresso!");
      return;
    }

    let updatedSteps = localSteps.map((step, sIndex) =>
      sIndex === stepIndex
        ? {
            ...step,
            checklist: step.checklist?.map((task, tIndex) =>
              tIndex === taskIndex ? { ...task, checked: !task.checked } : task
            ),
          }
        : step
    );
    setLocalSteps(updatedSteps);

    const toggledStep = updatedSteps[stepIndex];
    const isNowComplete = toggledStep.checklist
      ? toggledStep.checklist.every((task) => task.checked)
      : true;

    if (!isNowComplete) {
      updatedSteps = updatedSteps.map((step, idx) => {
        if (idx > stepIndex && step.checklist) {
          return {
            ...step,
            checklist: step.checklist.map((task) => ({ ...task, checked: false })),
          };
        }
        return step;
      });
      setActiveStep(stepIndex);
      setExpandedSteps((prev) => {
        const newExp = { ...prev };
        for (let i = stepIndex + 1; i < updatedSteps.length; i++) {
          newExp[i] = false;
        }
        return newExp;
      });
      setLocalSteps(updatedSteps);
    } else if (isNowComplete && stepIndex + 1 < updatedSteps.length) {
      setActiveStep(stepIndex + 1);
    }

    const progress_steps = updatedSteps.reduce((acc: any, step) => {
      acc[step.order] = step.checklist?.map((task) => ({ checked: task.checked }));
      return acc;
    }, {});
    const userRef = doc(db, "user_progress", userId);
    await setDoc(userRef, { progress_steps }, { merge: true });
  };

  const toggleExpansion = (stepIndex: number) => {
    if (!isStepCompleted(stepIndex)) return;
    setExpandedSteps((prev) => ({
      ...prev,
      [stepIndex]: !prev[stepIndex],
    }));
  };

  return (
    <div ref={containerRef} className="bg-white rounded-lg p-8 w-full max-w-4xl relative">
      <div
        className="absolute w-0.5 bg-gray-300"
        style={{
          top: `${lineStyle.top}px`,
          height: `${lineStyle.height}px`,
          left: `${lineStyle.left}px`,
        }}
      />
      {localSteps.length === 0 ? (
        <div>Carregando passos...</div>
      ) : (
        localSteps.map((step, index) => {
          const totalTasks = step.checklist ? step.checklist.length : 0;
          const completedTasks = step.checklist
            ? step.checklist.filter((task) => task.checked).length
            : 0;
          const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

          return (
            <div key={index} className="flex mb-10 last:mb-0 relative">
              <div className="relative flex items-center">
                <div
                  ref={
                    index === 0
                      ? firstCircleRef
                      : index === localSteps.length - 1
                      ? lastCircleRef
                      : undefined
                  }
                >
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
                    disabled={index !== 0 && !isStepCompleted(index - 1)}
                  >
                    {isStepCompleted(index) ? "✓" : ""}
                  </button>
                </div>
              </div>

              <div
                className="flex-1 ml-6 cursor-pointer select-none"
                onClick={() => toggleExpansion(index)}
              >
                <div
                  className={`p-4 w-full rounded-md flex items-center justify-between ${
                    isStepCompleted(index)
                      ? "bg-green-50 border border-green-500"
                      : activeStep === index
                      ? "bg-blue-50 border border-blue-500"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="mr-4">
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

                  {/* Exibe o botão "Ver Documento" para os passos 0, 1 e 2,
                      mas oculta no primeiro passo se hideFirstStepDocButton for true */}
                  {((index === 0 || index === 1 || index === 2) &&
                    showDocumentButton &&
                    !(hideFirstStepDocButton && index === 0)) && (
                    <button
                      className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 min-w-[150px] text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onStepClick) {
                          onStepClick(index);
                        }
                      }}
                    >
                      Ver Documento
                    </button>
                  )}
                </div>

                {totalTasks > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                )}

                {(activeStep === index || expandedSteps[index]) && step.checklist && (
                  <div className="mt-4 p-4 border border-gray-300 rounded-md bg-white">
                    {step.checklist.map((task, taskIndex) => (
                      <div
                        key={taskIndex}
                        className="flex items-center mb-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={task.checked}
                          onChange={() => toggleCheckbox(index, taskIndex)}
                          className="mr-2 cursor-pointer"
                        />
                        <span
                          className="text-sm text-gray-700"
                          dangerouslySetInnerHTML={{
                            __html: makeLinksClickable(task.task),
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Timeline;
