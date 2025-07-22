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
      <span 
        className={`w-8 h-8 flex items-center justify-center rounded-full border bg-white dark:bg-[var(--muted)]`}
        style={{
          borderColor: darkMode ? '#22c55e' : '#16a34a',
          borderWidth: '2px',
          boxShadow: darkMode 
            ? '0 1px 3px rgba(34, 197, 94, 0.2)' 
            : '0 1px 3px rgba(22, 163, 74, 0.15)'
        }}
      >
        <svg width="10" height="10" fill="none" stroke={darkMode ? "#22c55e" : "#16a34a"} strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (state === "active") {
    return (
      <span 
        className={`w-8 h-8 flex items-center justify-center rounded-full border bg-white dark:bg-[var(--muted)]`}
        style={{
          borderColor: darkMode ? '#60a5fa' : '#2563eb',
          borderWidth: '2px',
          boxShadow: darkMode 
            ? '0 2px 8px rgba(96, 165, 250, 0.3)' 
            : '0 2px 8px rgba(37, 99, 235, 0.2)'
        }}
      >
        <div 
          className={`w-3 h-3 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}`}
          style={{
            boxShadow: darkMode 
              ? '0 0 0 2px rgba(96, 165, 250, 0.2)' 
              : '0 0 0 2px rgba(37, 99, 235, 0.15)'
          }}
        />
      </span>
    );
  }
  return (
    <span 
      className={`w-8 h-8 flex items-center justify-center rounded-full border bg-white dark:bg-[var(--muted)]`}
      style={{
        borderColor: darkMode ? '#52525b' : '#d4d4d8',
        borderWidth: '1px',
        boxShadow: darkMode 
          ? '0 1px 2px rgba(0, 0, 0, 0.1)' 
          : '0 1px 2px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div 
        className={`w-2 h-2 rounded-full ${darkMode ? 'bg-zinc-400' : 'bg-zinc-300'}`}
        style={{ opacity: 0.7 }}
      />
    </span>
  );
};

const Stepper: React.FC<StepperProps> = ({ steps, current, darkMode, onStepClick, disabled }) => (
  <div className="flex items-center w-full py-3 gap-x-2 sm:gap-x-4 select-none">
    {steps.map((step, idx) => {
      const clickable = typeof onStepClick === 'function' && !disabled && idx !== current;
      const state = idx < current ? "completed" : idx === current ? "active" : "pending";
      
      return (
        <React.Fragment key={step}>
          <div className="flex-1 flex">
            <button
              type="button"
              className={`group flex flex-col items-center justify-center w-full px-3 py-2 border-none outline-none focus:outline-none transition relative ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
              style={{
                border: idx === current
                  ? `1.5px solid ${darkMode ? '#60a5fa' : '#2563eb'}`
                  : idx < current
                    ? `1px solid ${darkMode ? '#22c55e' : '#16a34a'}`
                    : `1px solid ${darkMode ? '#52525b' : '#d4d4d8'}`,
                borderRadius: 5,
                transition: 'all 0.3s ease',
                boxShadow: idx === current 
                  ? (darkMode 
                      ? '0 2px 12px rgba(96, 165, 250, 0.2), 0 0 0 1px rgba(96, 165, 250, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                      : '0 2px 12px rgba(37, 99, 235, 0.15), 0 0 0 1px rgba(37, 99, 235, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)')
                  : idx < current
                    ? (darkMode 
                        ? '0 1px 6px rgba(34, 197, 94, 0.1), 0 0 0 1px rgba(34, 197, 94, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.05)' 
                        : '0 1px 6px rgba(22, 163, 74, 0.08), 0 0 0 1px rgba(22, 163, 74, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.6)')
                    : (darkMode 
                        ? '0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)' 
                        : '0 1px 3px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.6)'),
                backgroundColor: idx === current 
                  ? (darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(239, 246, 255, 0.8)')
                  : idx < current
                    ? (darkMode ? 'rgba(6, 78, 59, 0.3)' : 'rgba(240, 253, 244, 0.6)')
                    : (darkMode ? 'rgba(24, 24, 27, 0.8)' : 'rgba(255, 255, 255, 0.8)'),
                backdropFilter: 'blur(12px) saturate(150%)',
                WebkitBackdropFilter: 'blur(12px) saturate(150%)',
                transform: idx === current ? 'scale(1.02)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (clickable) {
                  e.currentTarget.style.backgroundColor = darkMode ? 'rgba(39, 39, 42, 0.9)' : 'rgba(249, 250, 251, 0.9)';
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                  e.currentTarget.style.boxShadow = darkMode 
                    ? '0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                    : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (clickable) {
                  e.currentTarget.style.backgroundColor = idx === current 
                    ? (darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(239, 246, 255, 0.8)')
                    : idx < current
                      ? (darkMode ? 'rgba(6, 78, 59, 0.3)' : 'rgba(240, 253, 244, 0.6)')
                      : (darkMode ? 'rgba(24, 24, 27, 0.8)' : 'rgba(255, 255, 255, 0.8)');
                  e.currentTarget.style.transform = idx === current ? 'scale(1.02)' : 'scale(1)';
                  e.currentTarget.style.boxShadow = idx === current 
                    ? (darkMode 
                        ? '0 2px 12px rgba(96, 165, 250, 0.2), 0 0 0 1px rgba(96, 165, 250, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                        : '0 2px 12px rgba(37, 99, 235, 0.15), 0 0 0 1px rgba(37, 99, 235, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)')
                    : idx < current
                      ? (darkMode 
                          ? '0 1px 6px rgba(34, 197, 94, 0.1), 0 0 0 1px rgba(34, 197, 94, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.05)' 
                          : '0 1px 6px rgba(22, 163, 74, 0.08), 0 0 0 1px rgba(22, 163, 74, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.6)')
                      : (darkMode 
                          ? '0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)' 
                          : '0 1px 3px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.6)');
                }
              }}
              onClick={() => clickable && onStepClick && onStepClick(idx)}
              disabled={disabled}
              aria-current={idx === current ? 'step' : undefined}
            >
              <StepCircle state={state} darkMode={darkMode} />
              <span
                className={`mt-1.5 text-xs font-medium text-center break-words transition-colors ${state === "active"
                  ? (darkMode ? "text-blue-400 font-semibold" : "text-blue-600 font-semibold")
                  : state === "completed"
                    ? (darkMode ? "text-green-400 font-medium" : "text-green-700 font-medium")
                    : "text-zinc-500 dark:text-zinc-400"
                  } ${clickable ? 'group-hover:text-blue-500' : ''}`}
                style={{
                  cursor: clickable ? 'pointer' : 'default',
                  transition: 'color 0.2s',
                  wordBreak: 'break-word',
                  whiteSpace: 'normal',
                  lineHeight: '1.2',
                  textShadow: idx === current 
                    ? (darkMode ? '0 0 6px rgba(96, 165, 250, 0.2)' : '0 0 6px rgba(37, 99, 235, 0.15)')
                    : 'none',
                }}
              >
                {step}
              </span>
            </button>
          </div>
          {idx < steps.length - 1 && (
            <div className="flex-shrink-0 mx-1 sm:mx-2">
              <span 
                className="text-zinc-300 dark:text-zinc-600" 
                style={{ 
                  fontSize: 16, 
                  lineHeight: 1, 
                  userSelect: 'none',
                  fontWeight: 300
                }}
              >
                ›
              </span>
            </div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default Stepper; 