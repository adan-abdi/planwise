import React from "react";

interface StepperProps {
  darkMode: boolean;
}

interface StepCircleProps {
  state: "completed" | "active" | "pending";
  label: string;
  darkMode: boolean;
  stepNumber: number;
}

const StepCircle: React.FC<StepCircleProps> = ({ state, label, darkMode, stepNumber }) => {
  const baseCircle = "w-5 h-5 flex items-center justify-center rounded-full text-xs font-semibold transition-colors duration-150";
  if (state === "completed") {
    return (
      <span className={`${baseCircle} bg-zinc-400 text-white dark:bg-zinc-600`}>
        <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className={`${baseCircle} border-2 ${darkMode ? "border-blue-400 bg-transparent" : "border-blue-600 bg-transparent"} p-0 flex items-center justify-center`}> 
        <span className={`block rounded-full ${darkMode ? "bg-blue-400" : "bg-blue-600"}`} style={{ width: '8px', height: '8px' }} />
      </span>
    );
  }
  // pending
  return (
    <span className={`${baseCircle} border-2 ${darkMode ? "border-zinc-700 bg-transparent" : "border-zinc-300 bg-white"}`}></span>
  );
};

const Stepper: React.FC<StepperProps> = ({ darkMode }) => (
  <div className="flex items-center bg-white dark:bg-[var(--background)] border border-zinc-200 dark:border-zinc-700 rounded-full px-4 py-2 w-fit gap-2" style={{ borderColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>
    {/* Step 1: Upload documents (completed) */}
    <div className="flex items-center gap-2">
      <StepCircle state="completed" label="Upload documents" darkMode={darkMode} stepNumber={1} />
      <span className="text-base font-medium text-zinc-400">Upload documents</span>
    </div>
    <span className="mx-2 text-zinc-300">&#8250;</span>
    {/* Step 2: CFR Checklist (active) */}
    <div className="flex items-center gap-2">
      <StepCircle state="active" label="CFR Checklist" darkMode={darkMode} stepNumber={2} />
      <span className={"text-base font-medium " + (darkMode ? "text-blue-400" : "text-blue-600")}>CFR Checklist</span>
    </div>
    <span className="mx-2 text-zinc-300">&#8250;</span>
    {/* Step 3: Review (pending) */}
    <div className="flex items-center gap-2">
      <StepCircle state="pending" label="Review" darkMode={darkMode} stepNumber={3} />
      <span className="text-zinc-400 font-medium">Review</span>
    </div>
  </div>
);

export default Stepper; 