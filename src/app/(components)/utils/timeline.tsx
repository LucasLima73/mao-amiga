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
  hideDocumentButtonForSteps?: number[];
  progressKey?: string;
}

interface LineStyle {
  top: number;
  height: number;
  left: number;
}

// transforma URLs em links clicáveis
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
  hideDocumentButtonForSteps,
}) => {
  const [localSteps, setLocalSteps] = useState<Step[]>(steps);
  const [expandedSteps, setExpandedSteps] = useState<{ [key: number]: boolean }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const firstCircleRef = useRef<HTMLDivElement>(null);
  const lastCircleRef = useRef<HTMLDivElement>(null);

  const [lineStyle, setLineStyle] = useState<LineStyle>({ top: 0, height: 0, left: 0 });

  useEffect(() => {
    setLocalSteps(steps);
  }, [steps]);

  const isStepCompleted = (i: number) => {
    const list = localSteps[i]?.checklist;
    return list ? list.every((t) => t.checked) : true;
  };

  // define active e expanded inicial
  useEffect(() => {
    if (!localSteps.length) return;
    let newActive = localSteps.findIndex((_, i) => !isStepCompleted(i));
    if (newActive === -1) newActive = localSteps.length - 1;
    if (newActive !== activeStep) setActiveStep(newActive);
    const initExp: { [k: number]: boolean } = {};
    localSteps.forEach((_, i) => { initExp[i] = i === newActive; });
    setExpandedSteps(initExp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSteps]);

  // recalcula posição da linha
  const recalcLineStyle = useCallback(() => {
    if (containerRef.current && firstCircleRef.current && lastCircleRef.current) {
      const c = containerRef.current.getBoundingClientRect();
      const f = firstCircleRef.current.getBoundingClientRect();
      const l = lastCircleRef.current.getBoundingClientRect();
      const top = f.top - c.top + f.height / 2;
      const bottom = l.bottom - c.top - l.height / 2;
      setLineStyle({
        top,
        height: bottom - top,
        left: f.left - c.left + f.width / 2,
      });
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

    let updated = localSteps.map((step, si) =>
      si === stepIndex
        ? {
            ...step,
            checklist: step.checklist?.map((t, ti) =>
              ti === taskIndex ? { ...t, checked: !t.checked } : t
            ),
          }
        : step
    );
    setLocalSteps(updated);

    const nowComplete = updated[stepIndex].checklist?.every((t) => t.checked) ?? true;
    if (!nowComplete) {
      updated = updated.map((step, idx) =>
        idx > stepIndex && step.checklist
          ? {
              ...step,
              checklist: step.checklist.map((t) => ({ ...t, checked: false })),
            }
          : step
      );
      setActiveStep(stepIndex);
      setExpandedSteps((prev) => {
        const next = { ...prev };
        for (let i = stepIndex + 1; i < updated.length; i++) next[i] = false;
        return next;
      });
      setLocalSteps(updated);
    } else if (nowComplete && stepIndex + 1 < updated.length) {
      setActiveStep(stepIndex + 1);
    }

    const progress_steps = updated.reduce((acc: any, s) => {
      acc[s.order] = s.checklist?.map((t) => ({ checked: t.checked }));
      return acc;
    }, {});
    await setDoc(doc(db, "user_progress", userId!), { progress_steps }, { merge: true });
  };

  const toggleExpansion = (i: number) => {
    if (!isStepCompleted(i)) return;
    setExpandedSteps((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <div
      ref={containerRef}
      className="
        bg-white rounded-lg
        p-4 sm:p-6 md:p-8
        w-full max-w-full sm:max-w-lg md:max-w-4xl
        overflow-x-auto md:overflow-visible
        relative
      "
    >
      <div
        className="absolute w-0.5 bg-gray-300 hidden md:block"
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
          const total = step.checklist?.length ?? 0;
          const done = step.checklist?.filter((t) => t.checked).length ?? 0;
          const percent = total > 0 ? (done / total) * 100 : 0;

          return (
            <div
              key={index}
              className="flex flex-col md:flex-row mb-8 sm:mb-10 last:mb-0 relative"
            >
              <div className="relative flex items-start md:items-center">
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
                    disabled={index !== 0 && !isStepCompleted(index - 1)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      isStepCompleted(index)
                        ? "bg-green-500 text-white border-green-500"
                        : activeStep === index
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-400 border-gray-300"
                    }`}
                  >
                    {isStepCompleted(index) ? "✓" : ""}
                  </button>
                </div>
              </div>

              <div
                className="flex-1 mt-4 md:mt-0 ml-0 md:ml-6 cursor-pointer select-none"
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

                  {showDocumentButton &&
                    (!hideDocumentButtonForSteps ||
                      !hideDocumentButtonForSteps.includes(index)) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStepClick?.(index);
                        }}
                        className="
                          mt-4 md:mt-0
                          ml-0 md:ml-auto
                          w-full md:w-auto
                          px-4 py-2
                          bg-blue-600 text-white rounded hover:bg-blue-700
                          text-center
                        "
                      >
                        Ver Documento
                      </button>
                    )}
                </div>

                {total > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                )}

                {(activeStep === index || expandedSteps[index]) && step.checklist && (
                  <div className="mt-4 p-4 border border-gray-300 rounded-md bg-white">
                    {step.checklist.map((task, ti) => (
                      <div
                        key={ti}
                        className="flex items-center mb-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={task.checked}
                          onChange={() => toggleCheckbox(index, ti)}
                          className="mr-2 cursor-pointer"
                        />
                        <span
                          className="text-sm text-gray-700"
                          dangerouslySetInnerHTML={{ __html: makeLinksClickable(task.task) }}
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
