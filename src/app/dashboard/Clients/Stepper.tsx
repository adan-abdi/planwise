import React from "react";

interface StepperProps {
  steps: string[];
  current: number; // index of current step
  darkMode: boolean;
  onStepClick?: (idx: number) => void;
  disabled?: boolean;
}

interface StepCircleProps {
  state: "completed" | "active" | "pending";
  darkMode: boolean;
}

const StepCircle: React.FC<StepCircleProps> = ({ state, darkMode }) => {
  const baseCircle = "w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold transition-colors duration-150";
  if (state === "completed") {
    return (
      <span className={`${baseCircle} bg-zinc-400 text-white dark:bg-zinc-600`}>
        <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className={`${baseCircle} border-2 ${darkMode ? "border-blue-400 bg-transparent" : "border-blue-600 bg-transparent"} p-0 flex items-center justify-center shadow-md`}>
        <span className={`block rounded-full ${darkMode ? "bg-blue-400" : "bg-blue-600"}`} style={{ width: '10px', height: '10px' }} />
      </span>
    );
  }
  return (
    <span className={`${baseCircle} border-2 ${darkMode ? "border-zinc-700 bg-transparent" : "border-zinc-300 bg-white"}`}></span>
  );
};

const Stepper: React.FC<StepperProps> = ({ steps, current, darkMode, onStepClick, disabled }) => (
  <div className="flex items-center justify-center w-full max-w-3xl mx-auto px-2 sm:px-0 py-2 gap-0 select-none">
    {steps.map((step, idx) => {
      const clickable = typeof onStepClick === 'function' && !disabled && idx !== current;
      return (
        <React.Fragment key={step}>
          <button
            type="button"
            className={`group flex flex-col items-center flex-1 min-w-0 px-1 sm:px-2 py-0 bg-transparent border-none outline-none focus:outline-none transition relative ${clickable ? 'cursor-pointer' : 'cursor-default'} ${idx === current ? (darkMode ? 'z-10' : 'z-10') : ''}`}
            style={{
              background: 'none',
              boxShadow: idx === current ? (darkMode ? '0 0 0 2px #2563eb33' : '0 0 0 2px #2563eb22') : undefined,
              borderRadius: 12,
              transition: 'box-shadow 0.2s',
            }}
            onClick={() => clickable && onStepClick && onStepClick(idx)}
            disabled={disabled}
            aria-current={idx === current ? 'step' : undefined}
          >
            <StepCircle
              state={idx < current ? "completed" : idx === current ? "active" : "pending"}
              darkMode={darkMode}
            />
            <span
              className={
                `mt-2 text-sm font-medium text-center truncate max-w-[90px] sm:max-w-[120px] transition-colors ` +
                (idx < current
                  ? "text-zinc-400"
                  : idx === current
                  ? (darkMode ? "text-blue-400" : "text-blue-600")
                  : "text-zinc-400") +
                (clickable ? ' group-hover:text-blue-500 underline' : '')
              }
              style={{
                cursor: clickable ? 'pointer' : 'default',
                textDecoration: clickable ? 'underline' : 'none',
                transition: 'color 0.2s',
              }}
            >
              {step}
            </span>
          </button>
          {idx < steps.length - 1 && (
            <span className="flex-0 mx-1 sm:mx-2 text-zinc-300" style={{ fontSize: 24, lineHeight: 1, userSelect: 'none' }}>&#8250;</span>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default Stepper; 