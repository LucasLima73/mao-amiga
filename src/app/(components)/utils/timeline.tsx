'use client';

import React, { useState, useEffect, useRef } from "react";

interface Step {
  title: string; // Título do passo
  checklist: string[]; // Itens da checklist
  optionalIndexes?: number[]; // Índices dos itens opcionais
}

interface VerticalTimelineProps {
  title: string; // Título da linha do tempo
  steps: Step[]; // Passos dinâmicos contendo título e checklist
}

const VerticalTimeline: React.FC<VerticalTimelineProps> = ({ title, steps }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [visibleChecklists, setVisibleChecklists] = useState<{ [key: number]: boolean }>({
    0: true,
  });
  const [checklistStatus, setChecklistStatus] = useState<{ [key: number]: boolean[] }>(
    steps.reduce((acc, step, index) => {
      acc[index] = Array(step.checklist.length).fill(false);
      return acc;
    }, {} as { [key: number]: boolean[] })
  );

  const timelineContainerRef = useRef<HTMLDivElement | null>(null);
  const topPositionRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (timelineContainerRef.current && topPositionRef.current && stepRefs.current.length > 0) {
      const timelineLine = timelineContainerRef.current.querySelector(".timeline-line") as HTMLDivElement;

      if (timelineLine) {
        const topOffset = topPositionRef.current.offsetTop + topPositionRef.current.offsetHeight / 2;
        const lastStep = stepRefs.current[stepRefs.current.length - 1];

        if (lastStep) {
          const lastStepBox = lastStep.querySelector(".p-2.bg-white.rounded-lg");
          const lastStepBoxHeight = lastStepBox ? lastStepBox.clientHeight : 0;
          const bottomOffset = lastStep.offsetTop + lastStepBoxHeight / 2;

          timelineLine.style.top = `${topOffset}px`;
          timelineLine.style.height = `${bottomOffset - topOffset}px`;
        }
      }
    }
  }, [steps, completedSteps]);

  const handleChecklistItemChange = (stepIndex: number, itemIndex: number) => {
    const updatedChecklist = [...checklistStatus[stepIndex]];
    updatedChecklist[itemIndex] = !updatedChecklist[itemIndex];

    setChecklistStatus((prev) => ({
      ...prev,
      [stepIndex]: updatedChecklist,
    }));

    const step = steps[stepIndex];
    const mandatoryIndexes = step.optionalIndexes
      ? step.checklist.map((_, idx) => idx).filter((idx) => !step.optionalIndexes!.includes(idx))
      : step.checklist.map((_, idx) => idx);

    const allMandatoryCompleted = mandatoryIndexes.every((idx) => updatedChecklist[idx]);

    if (allMandatoryCompleted) {
      setCompletedSteps((prev) => [...prev, stepIndex]);
      setVisibleChecklists((prev) => ({
        ...prev,
        [stepIndex]: false,
        [stepIndex + 1]: stepIndex + 1 < steps.length ? true : false,
      }));
    } else {
      setCompletedSteps((prev) => prev.filter((step) => step !== stepIndex));

      for (let i = stepIndex + 1; i < steps.length; i++) {
        setVisibleChecklists((prev) => ({
          ...prev,
          [i]: false,
        }));

        setChecklistStatus((prev) => ({
          ...prev,
          [i]: Array(steps[i].checklist.length).fill(false),
        }));

        setCompletedSteps((prev) => prev.filter((step) => step !== i));
      }
    }
  };

  const toggleChecklistVisibility = (index: number) => {
    if (index === 0 || completedSteps.includes(index - 1)) {
      setVisibleChecklists((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    }
  };

  const calculateProgress = () => {
    let totalItems = 0;
    let completedItems = 0;

    steps.forEach((step, stepIndex) => {
      const mandatoryIndexes = step.optionalIndexes
        ? step.checklist.map((_, idx) => idx).filter((idx) => !step.optionalIndexes!.includes(idx))
        : step.checklist.map((_, idx) => idx);

      totalItems += mandatoryIndexes.length;
      completedItems += checklistStatus[stepIndex]?.filter((_, idx) => mandatoryIndexes.includes(idx) && checklistStatus[stepIndex][idx]).length || 0;
    });

    return (completedItems / totalItems) * 100;
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <h2 className="text-4xl font-bold text-[#ffde59] mb-6">{title}</h2>
  
      <div
        ref={timelineContainerRef}
        className="relative flex flex-col items-start"
      >
        <div
          className="timeline-line absolute w-1 bg-gray-300 left-[3%]"
          style={{ top: 0, height: 0 }}
        ></div>
  
        {steps.map((step, index) => {
          const mandatoryIndexes = step.optionalIndexes
            ? step.checklist.map((_, idx) => idx).filter((idx) => !step.optionalIndexes!.includes(idx))
            : step.checklist.map((_, idx) => idx);
  
          const completedMandatoryItems = checklistStatus[index]?.filter(
            (_, idx) => mandatoryIndexes.includes(idx) && checklistStatus[index][idx]
          ).length || 0;
  
          const progress = (completedMandatoryItems / mandatoryIndexes.length) * 100;
  
          return (
            <div
              key={index}
              ref={(el) => {
                if (el) stepRefs.current[index] = el;
              }}
              className="relative flex flex-col items-start mb-2 last:mb-0"
            >
              <div
                className={`flex items-center ${index === 0 || completedSteps.includes(index - 1) ? "cursor-pointer" : "cursor-not-allowed"}`}
                onClick={() => toggleChecklistVisibility(index)}
              >
                <div
                  className={`w-5 h-5 rounded-full relative z-10 ${
                    completedSteps.includes(index)
                      ? "bg-green-600 border-2 border-green-500"
                      : "bg-gray-400 border-2 border-gray-500"
                  }`}
                  ref={index === 0 ? topPositionRef : null}
                ></div>
                <div className="ml-4 p-2 rounded-lg bg-white shadow-md text-gray-700 relative w-80"> {/* Aumentado para w-80 */}
                  {step.title}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 rounded">
                    <div
                      className="h-full bg-green-500 rounded transition-all duration-300 ease-in-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className={`ml-9 mt-2 w-80 rounded-lg p-4 ${visibleChecklists[index] ? "bg-white" : "bg-transparent opacity-0 pointer-events-none"}`}> {/* Aumentado para w-80 */}
                {visibleChecklists[index] && (
                  <div>
                    {step.checklist.map((item, itemIndex) => (
                      <label key={itemIndex} className="flex items-start text-black mb-4">
                        <input
                          type="checkbox"
                          className="appearance-none w-5 h-5 border-2 border-gray-500 bg-white checked:bg-green-500 mr-2 rounded flex-shrink-0"
                          checked={checklistStatus[index]?.[itemIndex] || false}
                          onChange={() => handleChecklistItemChange(index, itemIndex)}
                        />
                        <span className="flex-grow">{item}</span>
                        {step.optionalIndexes?.includes(itemIndex) && (
                          <span className="text-gray-500 ml-1">(opcional)</span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Barra de progresso fixa na parte inferior da tela */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-200 h-2">
        <div
          className="h-full bg-green-500 transition-all duration-300 ease-in-out"
          style={{ width: `${calculateProgress()}%` }}
        ></div>
      </div>
    </div>
  );
};

export default VerticalTimeline;
