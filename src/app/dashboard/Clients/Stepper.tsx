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

const StepCircle: React.FC<StepCircleProps & { state: "completed" | "active" | "pending" }> = ({ state, darkMode }) => {
  if (state === "completed") {
    return (
      <span className={`w-7 h-7 flex items-center justify-center rounded-full border-2 border-green-500 bg-green-50 dark:bg-green-900/20`}>
        <svg width="16" height="16" fill="none" stroke="green" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className={`w-7 h-7 flex items-center justify-center rounded-full border-2 ${darkMode ? "border-blue-400" : "border-blue-600"} bg-white shadow`}>
        <span className={`block rounded-full ${darkMode ? "bg-blue-400" : "bg-blue-600"}`} style={{ width: '12px', height: '12px' }} />
      </span>
    );
  }
  return (
    <span className={`w-7 h-7 flex items-center justify-center rounded-full border-2 border-zinc-200 bg-white dark:bg-zinc-900`} style={{ backgroundColor: darkMode ? '#18181b' : '#ffffff' }} />
  );
};

const Stepper: React.FC<StepperProps> = ({ steps, current, darkMode, onStepClick, disabled }) => (
  <div className="flex items-center justify-center w-full px-2 sm:px-0 py-2 gap-x-2 select-none">
    {steps.map((step, idx) => {
      const clickable = typeof onStepClick === 'function' && !disabled && idx !== current;
      const state = idx < current ? "completed" : idx === current ? "active" : "pending";
      let boxBg = "";
      if (state === "active") boxBg = darkMode ? "bg-blue-900/20" : "bg-blue-50";
      if (state === "completed") boxBg = darkMode ? "bg-green-900/20" : "bg-green-50";
      if (state === "pending") boxBg = darkMode ? "bg-zinc-900" : "bg-white";
      return (
        <React.Fragment key={step}>
          <button
            type="button"
            className={`group flex flex-col items-center justify-center flex-1 min-w-0 px-2 py-2 border-none outline-none focus:outline-none transition relative rounded-lg ${boxBg} ${clickable ? 'cursor-pointer' : 'cursor-default'} ${idx === current ? (darkMode ? 'z-10' : 'z-10') : ''}`}
            style={{
              border: idx === current
                ? `2px solid ${darkMode ? '#60a5fa' : '#2563eb'}`
                : `1.5px solid ${darkMode ? '#27272a' : '#e4e4e7'}`,
              borderRadius: 10,
              transition: 'box-shadow 0.2s, border 0.2s, background-color 0.2s',
              boxShadow: idx === current ? (darkMode ? '0 0 0 2px #2563eb33' : '0 0 0 2px #2563eb22') : undefined,
              backgroundColor: clickable && state === 'pending' ? (darkMode ? '#18181b' : '#ffffff') : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (clickable) {
                e.currentTarget.style.backgroundColor = darkMode ? '#27272a' : '#fafafa';
              }
            }}
            onMouseLeave={(e) => {
              if (clickable) {
                e.currentTarget.style.backgroundColor = state === 'pending' ? (darkMode ? '#18181b' : '#ffffff') : 'transparent';
              }
            }}
            onClick={() => clickable && onStepClick && onStepClick(idx)}
            disabled={disabled}
            aria-current={idx === current ? 'step' : undefined}
          >
            <StepCircle state={state} darkMode={darkMode} />
            <span
              className={`mt-2 text-base font-medium text-center break-words transition-colors ${state === "active"
                ? (darkMode ? "text-blue-400 font-bold" : "text-blue-600 font-bold")
                : state === "completed"
                  ? "text-green-700 dark:text-green-400"
                  : "text-zinc-400"
                } ${clickable ? ' group-hover:text-blue-500 underline' : ''}`}
              style={{
                cursor: clickable ? 'pointer' : 'default',
                textDecoration: clickable ? 'underline' : 'none',
                transition: 'color 0.2s',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
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