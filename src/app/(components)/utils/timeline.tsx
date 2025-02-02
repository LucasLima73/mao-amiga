'use client';

import React, { useState, useEffect, useRef } from "react";

interface Step {
  title: string;
  checklist: ChecklistItem[];
  optionalIndexes?: number[];
  order: number;
}

interface ChecklistItem {
  task: string;
  link?: string;
  checked: boolean;
}

interface VerticalTimelineProps {
  title: string;
  steps: Step[];
  activeStep: number;
  userId: string | null;
  toggleCheckbox: (stepIndex: number, taskIndex: number) => void;
}

const VerticalTimeline: React.FC<VerticalTimelineProps> = ({ title, steps, activeStep, userId, toggleCheckbox }) => {
  const [visibleChecklists, setVisibleChecklists] = useState<{ [key: number]: boolean }>({ 0: true });
  
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const topPositionRef = useRef<HTMLDivElement | null>(null);
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);

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
  }, [steps]);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <h2 className="text-4xl font-bold text-[#ffde59] mb-6">{title}</h2>

      <div ref={timelineContainerRef} className="relative flex flex-col items-start">
        <div className="timeline-line absolute w-1 bg-gray-300 left-[3%]" style={{ top: 0, height: 0 }}></div>

        {steps.map((step, index) => {
          return (
            <div
              key={index}
              ref={(el) => {
                if (el) stepRefs.current[index] = el;
              }}
              className="relative flex flex-col items-start mb-2 last:mb-0"
            >
              <div className="flex items-center cursor-pointer" onClick={() => setVisibleChecklists((prev) => ({ ...prev, [index]: !prev[index] }))}>
                <div
                  className={`w-5 h-5 rounded-full relative z-10 ${index <= activeStep ? "bg-green-600 border-2 border-green-500" : "bg-gray-400 border-2 border-gray-500"}`}
                  ref={index === 0 ? topPositionRef : null}
                ></div>
                <div className="ml-4 p-2 rounded-lg bg-white shadow-md text-gray-700 relative w-80">
                  {step.title}
                </div>
              </div>
              <div className={`ml-9 mt-2 w-80 rounded-lg p-4 ${visibleChecklists[index] ? "bg-white" : "bg-transparent opacity-0 pointer-events-none"}`}>
                {visibleChecklists[index] && (
                  <div>
                    {step.checklist.map((item, itemIndex) => (
                      <label key={itemIndex} className="flex items-start text-black mb-4">
                        <input
                          type="checkbox"
                          className="appearance-none w-5 h-5 border-2 border-gray-500 bg-white checked:bg-green-500 mr-2 rounded flex-shrink-0"
                          checked={item.checked}
                          onChange={() => toggleCheckbox(index, itemIndex)}
                          disabled={!userId} // Desabilita se não houver usuário logado
                        />
                        <span className="flex-grow">
                          {item.link ? (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">
                              {item.task}
                            </a>
                          ) : (
                            item.task
                          )}
                        </span>
                        {step.optionalIndexes?.includes(itemIndex) && <span className="text-gray-500 ml-1">(opcional)</span>}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VerticalTimeline;
