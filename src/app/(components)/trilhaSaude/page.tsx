"use client";

import React, { useState } from "react";

interface Step {
  title: string;
  description: string;
  checklist?: { task: string; checked: boolean }[];
}

const TrilhaSaude: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([
    {
      title: "Primeiro Passo",
      description:
        "Obter um documento de identificação. Este é o primeiro passo para acessar serviços públicos.",
      checklist: [
        { task: "Reunir Documentos", checked: false },
        { task: "Enviar Solicitação", checked: false },
        { task: "Receber Confirmação", checked: false },
      ],
    },
    {
      title: "Segundo Passo",
      description:
        "Conseguir o CPF (Cadastro de Pessoa Física). O CPF é essencial em vários serviços.",
      checklist: [
        { task: "Verificar Documentos", checked: false },
        { task: "Solicitar CPF", checked: false },
        { task: "Receber CPF", checked: false },
      ],
    },
    {
      title: "Terceiro Passo",
      description:
        "Garantir um comprovante de residência. Exemplo: conta de luz ou telefone.",
      checklist: [
        { task: "Verificar Contas", checked: false },
        { task: "Enviar Comprovante", checked: false },
      ],
    },
  ]);

  const isStepCompleted = (stepIndex: number) => {
    const checklist = steps[stepIndex]?.checklist;
    return checklist ? checklist.every((task) => task.checked) : true;
  };

  const toggleCheckbox = (stepIndex: number, taskIndex: number) => {
    const updatedSteps = steps.map((step, sIndex) =>
      sIndex === stepIndex
        ? {
            ...step,
            checklist: step.checklist?.map((task, tIndex) =>
              tIndex === taskIndex
                ? { ...task, checked: !task.checked }
                : task
            ),
          }
        : step
    );

    setSteps(updatedSteps);

    // Verifica se o passo foi concluído e seleciona o próximo automaticamente
    if (
      updatedSteps[stepIndex].checklist &&
      updatedSteps[stepIndex].checklist!.every((task) => task.checked)
    ) {
      const nextStep = stepIndex + 1;
      if (nextStep < steps.length) {
        setActiveStep(nextStep);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl">
        {steps.map((step, index) => (
          <div key={index} className="relative flex mb-10 last:mb-0">
            {/* Bolinha clicável */}
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

            {/* Conteúdo do Passo */}
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

              {/* Barra de progresso com animação */}
              {activeStep === index && step.checklist && (
                <div className="w-full mt-2">
                  <div className="h-2 w-full bg-gray-200 rounded-md">
                    <div
                      className="h-2 bg-green-500 rounded-md"
                      style={{
                        width: `${
                          (step.checklist.filter((t) => t.checked).length /
                            step.checklist.length) *
                          100
                        }%`,
                        transition: "width 0.4s ease-in-out", // Adiciona a animação
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Checklist */}
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
        ))}
      </div>
    </div>
  );
};

export default TrilhaSaude;
