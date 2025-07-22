import React, { useState, useEffect } from "react";

interface ESS {
  employerName: string;
  schemeProvider: string;
  complete: boolean;
}



interface ESSFormProps {
  darkMode: boolean;
  ess: ESS;
  onSave: (ess: ESS) => void;
  onCancel: () => void;
}

export default function ESSForm({ darkMode, ess, onSave, onCancel }: ESSFormProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [formState, setFormState] = useState<{
    employerName: string;
    schemeProvider: string;
    loyaltyBonuses: string;
    initialChargeSingle: string;
    initialChargeTransfers: string;
    initialChargeRegular: string;
    productWrapperCharge: string;
    fromMonth: string;
    toMonth: string;
    sameAnnualCharge: string;
    fixedCharge: string;
    complete: boolean;
  }>({
    // ESS-specific form fields
    employerName: ess.employerName || '',
    schemeProvider: ess.schemeProvider || '',
    loyaltyBonuses: '',
    initialChargeSingle: '',
    initialChargeTransfers: '',
    initialChargeRegular: '',
    productWrapperCharge: '',
    fromMonth: '1',
    toMonth: '',
    sameAnnualCharge: '',
    fixedCharge: '',
    complete: false
  });

  // Update formState on prop change
  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      employerName: ess.employerName || '',
      schemeProvider: ess.schemeProvider || ''
    }));
  }, [ess]);

  const handleSave = () => {
    const updatedESS: ESS = {
      employerName: formState.employerName,
      schemeProvider: formState.schemeProvider,
      complete: true
    };
    onSave(updatedESS);
  };

  // Helper functions for form handling
  const getRadioValue = (label: string) => {
    switch (label) {
      case "Does the plan have any Loyalty Bonuses?":
        return formState.loyaltyBonuses;
      case "Is an initial charge applied to new single contributions?":
        return formState.initialChargeSingle;
      case "Is an initial charge applied to transfers in?":
        return formState.initialChargeTransfers;
      case "Is an Initial Charge applied to regular contributions?":
        return formState.initialChargeRegular;
      case "Do all funds have the same annual charge?":
        return formState.sameAnnualCharge;
      case "Does this plan have a fixed charge/policy fee?":
        return formState.fixedCharge;
      default:
        return "";
    }
  };

  const handleRadioChange = (label: string, value: string) => {
    switch (label) {
      case "Does the plan have any Loyalty Bonuses?":
        setFormState({ ...formState, loyaltyBonuses: value });
        break;
      case "Is an initial charge applied to new single contributions?":
        setFormState({ ...formState, initialChargeSingle: value });
        break;
      case "Is an initial charge applied to transfers in?":
        setFormState({ ...formState, initialChargeTransfers: value });
        break;
      case "Is an Initial Charge applied to regular contributions?":
        setFormState({ ...formState, initialChargeRegular: value });
        break;
      case "Do all funds have the same annual charge?":
        setFormState({ ...formState, sameAnnualCharge: value });
        break;
      case "Does this plan have a fixed charge/policy fee?":
        setFormState({ ...formState, fixedCharge: value });
        break;
    }
  };

  const getInputValue = (label: string) => {
    switch (label) {
      case "Employer":
        return formState.employerName;
      case "Scheme provider":
        return formState.schemeProvider;
      case "Product/Wrapper annual charge":
        return formState.productWrapperCharge;
      case "From month":
        return formState.fromMonth;
      case "To month":
        return formState.toMonth;
      default:
        return "";
    }
  };

  const handleInputChange = (label: string, value: string) => {
    switch (label) {
      case "Employer":
        setFormState({ ...formState, employerName: value });
        break;
      case "Scheme provider":
        setFormState({ ...formState, schemeProvider: value });
        break;
      case "Product/Wrapper annual charge":
        setFormState({ ...formState, productWrapperCharge: value });
        break;
      case "From month":
        setFormState({ ...formState, fromMonth: value });
        break;
      case "To month":
        setFormState({ ...formState, toMonth: value });
        break;
    }
  };

  // ESS-specific questions and guides
  const essQuestions = [
    { label: "Employer", placeholder: "Enter employer name", type: "text" },
    { label: "Scheme provider", placeholder: "Enter scheme provider", type: "text" },
    { label: "Does the plan have any Loyalty Bonuses?", placeholder: "Select yes or no", type: "radio", options: ["Yes", "No"] },
    { label: "Plan Charges", placeholder: "", type: "heading" },
    { label: "Is an initial charge applied to new single contributions?", placeholder: "Select yes or no", type: "radio", options: ["Yes", "No"] },
    { label: "Is an initial charge applied to transfers in?", placeholder: "Select yes or no", type: "radio", options: ["Yes", "No"] },
    { label: "Is an Initial Charge applied to regular contributions?", placeholder: "Select yes or no", type: "radio", options: ["Yes", "No"] },
    { label: "Enter the Annual Management Charges (AMC) for the next 1 months of the policy.", placeholder: "", type: "section" },
    { label: "Product/Wrapper annual charge", placeholder: "Enter charge percentage", type: "text", suffix: "%" },
    { label: "From month", placeholder: "Enter from month", type: "text" },
    { label: "To month", placeholder: "Enter to month", type: "text" },
    { label: "Do all funds have the same annual charge?", placeholder: "Select option", type: "radio", options: ["Yes", "No", "Not applicable"] },
    { label: "Does this plan have a fixed charge/policy fee?", placeholder: "Select yes or no", type: "radio", options: ["Yes", "No"] },
  ];

  const essGuides = [
    "Enter the name of the employer sponsoring this pension scheme",
    "This is usually a pension provider such as AXA, Standard Life, etc.",
    "Don't enter bonuses if they are discretionary.",
    "", // Empty guide for heading
    "", // Empty guide for initial charge questions
    "", // Empty guide for initial charge questions
    "", // Empty guide for initial charge questions
    "At least one Product/wrapper annual change from month 1 to month 1 must be included.",
    "", // Empty guide for charge input
    "", // Empty guide for from month
    "", // Empty guide for to month
    "", // Empty guide for same annual charge
    "", // Empty guide for fixed charge
  ];

  return (
    <div className="flex-1 w-full flex flex-col min-h-0 bg-white">
      <div className="flex-1 overflow-y-auto px-8 py-4 min-h-0 bg-white">
        {essQuestions.map((q, idx) => (
          <div key={q.label} className="flex flex-row w-full items-stretch">
            {/* Question (left) */}
            <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
              {q.type === 'heading' ? (
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>
                  {q.label}
                </h3>
              ) : q.type === 'section' ? (
                <p className={`text-base font-medium ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>
                  {q.label}
                </p>
              ) : (
                <>
                  <label
                    className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                    htmlFor={`q-${idx}`}
                  >
                    {q.label}
                  </label>
                  {q.type === 'radio' ? (
                    <div className="flex gap-6 mt-1">
                      {q.options?.map(opt => (
                        <label key={opt} className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name={q.label}
                            value={opt}
                            checked={getRadioValue(q.label) === opt}
                            onChange={(e) => handleRadioChange(q.label, e.target.value)}
                            className="accent-blue-600 w-4 h-4 mr-2"
                          />
                          <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="relative w-full">
                      <input
                        id={`q-${idx}`}
                        type="text"
                        placeholder={q.placeholder}
                        value={getInputValue(q.label)}
                        onChange={(e) => handleInputChange(q.label, e.target.value)}
                        className={`w-full px-3 py-2 rounded border outline-none transition focus:ring-2 ${
                          darkMode
                            ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                            : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                        } ${activeIndex === idx ? 'ring-2 ring-blue-400' : ''} ${q.suffix ? 'pr-8' : ''}`}
                        onFocus={() => setActiveIndex(idx)}
                        onClick={() => setActiveIndex(idx)}
                      />
                      {q.suffix && (
                        <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          {q.suffix}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            {/* Divider */}
            <div
              className="self-stretch mx-2"
              style={{
                width: '2px',
                background: darkMode ? '#3f3f46' : '#e4e4e7',
              }}
            />
            {/* Guide (right) */}
            <div className="flex-1 pl-8 py-2 flex items-start min-h-[40px]">
              <span className={`text-sm text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>{essGuides[idx]}</span>
            </div>
          </div>
        ))}
        
        {/* Add another product/wrapper charge button */}
        <div className="flex flex-row w-full items-stretch mt-4">
          <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
            <button
              type="button"
              className="px-6 py-2 rounded-lg text-sm font-medium transition border border-blue-600 text-blue-600 hover:bg-blue-50 w-80"
            >
              Add another product/wrapper charge
            </button>
          </div>
          <div
            className="self-stretch mx-2"
            style={{
              width: '2px',
              background: darkMode ? '#3f3f46' : '#e4e4e7',
            }}
          />
          <div className="flex-1 pl-8 py-2 flex items-start min-h-[40px]">
            <span className={`text-sm text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}></span>
          </div>
        </div>

        {/* Additional Notes Section */}
        <div className="flex flex-row w-full items-stretch">
          {/* Textarea (left) */}
          <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
            <label
              className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
              htmlFor="additional-notes"
            >
              Additional notes
            </label>
            <textarea
              id="additional-notes"
              rows={3}
              placeholder="Enter any supporting notes here..."
              className={`w-full px-3 py-2 rounded border outline-none transition focus:ring-2 resize-y min-h-[80px] ${
                darkMode
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                  : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
              }`}
              style={{ fontSize: 15 }}
            />
          </div>
          {/* Divider */}
          <div
            className="self-stretch mx-2"
            style={{
              width: '2px',
              background: darkMode ? '#3f3f46' : '#e4e4e7',
            }}
          />
          {/* Guide (right) */}
          <div className="flex-1 pl-8 py-2 flex items-start min-h-[40px]">
            <span className={`text-sm text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Supporting notes requested while completing this page or that you believe will help clarify ESS details should be written in this box - these will appear in output from this calculator.</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="w-full flex justify-end items-center py-4 bg-inherit gap-2">
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-normal transition border border-zinc-200 dark:border-[var(--border)]"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-normal bg-blue-600 text-white transition border border-blue-600 hover:bg-blue-700 hover:border-blue-700"
            onClick={handleSave}
          >
            Save and Continue
          </button>
        </div>
      </div>
    </div>
  );
} 