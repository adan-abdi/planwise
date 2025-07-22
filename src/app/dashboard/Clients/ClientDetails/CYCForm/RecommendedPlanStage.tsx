import React, { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";

interface RecommendedPlanStageProps {
  darkMode: boolean;
}

const RecommendedPlanStage: React.FC<RecommendedPlanStageProps> = ({ darkMode }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [formState, setFormState] = useState<{
    recommendedProduct: string;
    ongoingAdviceFee: string;
    topUpExisting: string;
    transferValue: string;
    newSingleContribution: string;
    totalLumpSum: string;
    frequency: string;
    newRegularContribution: string;
    totalRegularContributions: string;
    drawdownFuture: string;
    reduceIAF: string;
    sjpPortfolio: string;
    sjpAllocation: string;
    polarisFund: string;
    polarisAllocation: string;
    sjpFund: string;
    sjpFundAllocation: string;
    amcCharges: string;
    totalAllocated: string;
    additionalNotes: string;
    complete: boolean;
    [key: string]: string | boolean;
  }>({
    recommendedProduct: '',
    ongoingAdviceFee: '',
    topUpExisting: '',
    transferValue: '£100,000.00',
    newSingleContribution: '',
    totalLumpSum: '£100,000.00',
    frequency: 'Monthly',
    newRegularContribution: '',
    totalRegularContributions: '£0.00',
    drawdownFuture: '',
    reduceIAF: '',
    sjpPortfolio: '',
    sjpAllocation: '',
    polarisFund: '',
    polarisAllocation: '',
    sjpFund: '',
    sjpFundAllocation: '',
    amcCharges: '',
    totalAllocated: '0.00%',
    additionalNotes: '',
    complete: false
  });

  // Calculate total allocation
  const calculateTotalAllocation = useCallback(() => {
    const sjpAlloc = parseFloat(formState.sjpAllocation) || 0;
    const polarisAlloc = parseFloat(formState.polarisAllocation) || 0;
    const sjpFundAlloc = parseFloat(formState.sjpFundAllocation) || 0;
    const total = sjpAlloc + polarisAlloc + sjpFundAlloc;
    return total.toFixed(2);
  }, [formState.sjpAllocation, formState.polarisAllocation, formState.sjpFundAllocation]);

  // Update total allocation in form state
  React.useEffect(() => {
    const total = calculateTotalAllocation();
    setFormState((prev) => ({ ...prev, totalAllocated: `${total}%` }));
  }, [formState.sjpAllocation, formState.polarisAllocation, formState.sjpFundAllocation, calculateTotalAllocation]);

  // Check if allocation is complete (equals 100%)
  const isAllocationComplete = () => {
    const total = parseFloat(calculateTotalAllocation());
    return total === 100;
  };

  // Recommended plan questions and guides
  const recommendedPlanQuestions: Array<{
    label: string;
    placeholder: string;
    type: string;
    options?: string[];
    suffix?: string;
    value?: string;
    inline?: boolean;
    conditional?: string;
    conditionalValue?: string;
    min?: string;
    max?: string;
    step?: string;
  }> = [
    {
      label: "Recommended plan",
      placeholder: "",
      type: "heading"
    },
    {
      label: "Tell us about the replacement plan being recommended. All fields are required unless indicated otherwise.",
      placeholder: "",
      type: "section"
    },
    {
      label: "Recommended product",
      placeholder: "Select a product",
      type: "select",
      options: ["Retirement Account", "Trustee Investment Account"]
    },
    {
      label: "Ongoing Advice Fee (OAF)",
      placeholder: "0.00",
      type: "text",
      suffix: "%"
    },
    {
      label: "Is this a top-up to an existing SJP Plan?",
      placeholder: "",
      type: "radio",
      options: ["Yes", "No"]
    },
    {
      label: "Lump sums",
      placeholder: "",
      type: "heading"
    },
    {
      label: "Transfer value",
      placeholder: "",
      type: "readonly",
      value: "£100,000.00"
    },
    {
      label: "New single contribution, if any",
      placeholder: "0.00",
      type: "text",
      suffix: "£"
    },
    {
      label: "Total lump sum",
      placeholder: "",
      type: "readonly",
      value: "£100,000.00"
    },
    {
      label: "Regular contributions",
      placeholder: "",
      type: "heading"
    },
    {
      label: "Frequency",
      placeholder: "Select frequency",
      type: "select",
      options: ["Monthly", "Quarterly", "Annually"]
    },
    {
      label: "New regular contribution, if any",
      placeholder: "0.00",
      type: "text",
      suffix: "£"
    },
    {
      label: "Total regular contributions",
      placeholder: "",
      type: "readonly",
      value: "£0.00"
    },
    {
      label: "Will the client enter drawdown when taking benefits in the future?",
      placeholder: "",
      type: "radio",
      options: ["Yes", "No"]
    },
    {
      label: "Will you be reducing IAF and Credit to remove the Early Withdrawal Charges on future tax free cash payments?",
      placeholder: "",
      type: "radio",
      options: ["Yes", "No"],
      conditional: "drawdownFuture",
      conditionalValue: "Yes"
    },
    {
      label: "Fund & Portfolio selection - Lump sum",
      placeholder: "",
      type: "heading"
    },
    {
      label: "SJP Portfolios",
      placeholder: "Select SJP Portfolio",
      type: "select",
      options: ["Adventurous", "Balanced", "Conservative", "Managed Funds", "Strategic Growth"],
      inline: true
    },
    {
      label: "SJP Portfolio Allocation",
      placeholder: "0.00",
      type: "number",
      suffix: "%",
      inline: true,
      min: "0",
      max: "100",
      step: "0.01"
    },
    {
      label: "Add another SJP portfolio",
      placeholder: "",
      type: "button"
    },
    {
      label: "Polaris & InRetirement Range",
      placeholder: "",
      type: "heading"
    },
    {
      label: "Polaris Fund",
      placeholder: "Select Polaris Fund",
      type: "select",
      options: ["Polaris 1", "Polaris 2", "Polaris 3", "Polaris 4", "Balance InRetirement", "Growth InRetirement", "Prudence InRetirement"],
      inline: true
    },
    {
      label: "Polaris Fund Allocation",
      placeholder: "0.00",
      type: "number",
      suffix: "%",
      inline: true,
      min: "0",
      max: "100",
      step: "0.01"
    },
    {
      label: "Add another InRetirement Fund",
      placeholder: "",
      type: "button"
    },
    {
      label: "SJP Funds",
      placeholder: "",
      type: "heading"
    },
    {
      label: "SJP Fund",
      placeholder: "Select SJP Fund",
      type: "select",
      options: [
        "Asia Pacific",
        "Balanced Managed",
        "Continental European",
        "Corporate Bond",
        "Diversified Assets (FAIF)",
        "Diversified Bond",
        "Emerging Markets Equity",
        "Global Absolute Return",
        "Global Emerging Markets",
        "Global Equity",
        "Global Government Bond",
        "Global Government Inflation Linked Bond",
        "Global Growth",
        "Global High Yield Bond",
        "Global Managed",
        "Global Quality",
        "Global Smaller Companies",
        "Global Value",
        "Greater European",
        "International Equity",
        "Investment Grade Corporate Bond",
        "Japan",
        "Managed Growth",
        "Money Market",
        "North American",
        "Strategic Income",
        "Strategic Managed",
        "Sustainable & Responsible Equity",
        "UK",
        "UK Equity Income",
        "Worldwide Income"
      ],
      inline: true
    },
    {
      label: "SJP Fund Allocation",
      placeholder: "0.00",
      type: "number",
      suffix: "%",
      inline: true,
      min: "0",
      max: "100",
      step: "0.01"
    },
    {
      label: "Add another SJP fund",
      placeholder: "",
      type: "button"
    },
    {
      label: "AMC and Funds charges",
      placeholder: "0.00",
      type: "text",
      suffix: "%",
      inline: true
    },
    {
      label: "Total allocated",
      placeholder: "",
      type: "readonly",
      value: formState.totalAllocated || "0.00%",
      inline: true
    }
  ];

  const recommendedPlanGuides: string[] = [
    "",
    "",
    "",
    "Enter a value between 0.25% and 0.5%.",
    "",
    "",
    "This is the total of all the plans to be replaced.",
    "Enter any new single contribution being paid (in addition to lump sum transfers). Please note that any amount added in this field may be used to \"cross-subsidise\" within the Critical Yield calculation.",
    "",
    "",
    "",
    "Please enter any new contribution being paid (in addition to redirected regular contribution). Please note that any amount added in this field may be used to 'cross-subsidise' within the Critical Yield calculation.",
    "",
    "",
    "",
    "",
    "Choose an SJP Portfolio OR you can create your own bespoke portfolio by selecting from the SJP Funds list.",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "The results page will show the full amount of IAF and Credit to enter as the required amounts on the illustration system. The illustration system will then reduce these by 25% to facilitate the removal of Early Withdrawal Charges.",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Ensure this total equals 100% otherwise review your fund selection."
  ];

  // Helper functions for form handling
  const getRadioValue = (label: string) => {
    switch (label) {
      case "Will the client enter drawdown when taking benefits in the future?":
        return formState.drawdownFuture;
      case "Will you be reducing IAF and Credit to remove the Early Withdrawal Charges on future tax free cash payments?":
        return formState.reduceIAF;
      case "Is this a top-up to an existing SJP Plan?":
        return formState.topUpExisting;
      default:
        return "";
    }
  };

  const handleRadioChange = (label: string, value: string) => {
    switch (label) {
      case "Will the client enter drawdown when taking benefits in the future?":
        setFormState({ ...formState, drawdownFuture: value });
        break;
      case "Will you be reducing IAF and Credit to remove the Early Withdrawal Charges on future tax free cash payments?":
        setFormState({ ...formState, reduceIAF: value });
        break;
      case "Is this a top-up to an existing SJP Plan?":
        setFormState({ ...formState, topUpExisting: value });
        break;
    }
  };

  const getInputValue = (label: string) => {
    switch (label) {
      case "Ongoing Advice Fee (OAF)":
        return formState.ongoingAdviceFee;
      case "New single contribution, if any":
        return formState.newSingleContribution;
      case "New regular contribution, if any":
        return formState.newRegularContribution;
      case "SJP Portfolio Allocation":
        return formState.sjpAllocation;
      case "Polaris Fund Allocation":
        return formState.polarisAllocation;
      case "SJP Fund Allocation":
        return formState.sjpFundAllocation;
      case "Polaris Fund":
        return formState.polarisFund;
      case "SJP Fund":
        return formState.sjpFund;
      case "AMC and Funds charges":
        return formState.amcCharges;
      case "Additional plan notes":
        return formState.additionalNotes;
      default:
        return "";
    }
  };

  const handleInputChange = (label: string, value: string) => {
    switch (label) {
      case "Ongoing Advice Fee (OAF)":
        setFormState({ ...formState, ongoingAdviceFee: value });
        break;
      case "New single contribution, if any":
        setFormState({ ...formState, newSingleContribution: value });
        break;
      case "New regular contribution, if any":
        setFormState({ ...formState, newRegularContribution: value });
        break;
      case "SJP Portfolio Allocation":
        setFormState({ ...formState, sjpAllocation: value });
        break;
      case "Polaris Fund Allocation":
        setFormState({ ...formState, polarisAllocation: value });
        break;
      case "SJP Fund Allocation":
        setFormState({ ...formState, sjpFundAllocation: value });
        break;
      case "Polaris Fund":
        setFormState({ ...formState, polarisFund: value });
        break;
      case "SJP Fund":
        setFormState({ ...formState, sjpFund: value });
        break;
      case "AMC and Funds charges":
        setFormState({ ...formState, amcCharges: value });
        break;
      case "Additional plan notes":
        setFormState({ ...formState, additionalNotes: value });
        break;
    }
  };

  const getSelectValue = (label: string) => {
    switch (label) {
      case "Recommended product":
        return formState.recommendedProduct;
      case "Frequency":
        return formState.frequency;
      case "SJP Portfolios":
        return formState.sjpPortfolio;
      case "Polaris Fund":
        return formState.polarisFund;
      case "SJP Fund":
        return formState.sjpFund;
      default:
        return "";
    }
  };

  const handleSelectChange = (label: string, value: string) => {
    switch (label) {
      case "Recommended product":
        setFormState({ ...formState, recommendedProduct: value });
        break;
      case "Frequency":
        setFormState({ ...formState, frequency: value });
        break;
      case "SJP Portfolios":
        setFormState({ ...formState, sjpPortfolio: value });
        break;
      case "Polaris Fund":
        setFormState({ ...formState, polarisFund: value });
        break;
      case "SJP Fund":
        setFormState({ ...formState, sjpFund: value });
        break;
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto px-8 py-4 min-h-0">
        {(() => {
          const rows: React.JSX.Element[] = [];
          let i = 0;
          
          while (i < recommendedPlanQuestions.length) {
            const currentQ = recommendedPlanQuestions[i];
            
            // Check if this question should be shown based on conditional logic
            if (currentQ.conditional) {
              const conditionalValue = formState[currentQ.conditional];
              if (conditionalValue !== currentQ.conditionalValue) {
                i += 1;
                continue; // Skip this question
              }
            }
            
            // Check if current and next question are inline
            const nextQ = recommendedPlanQuestions[i + 1];
            const isInlinePair = currentQ.inline && nextQ?.inline;
            
            if (isInlinePair) {
              // Render inline pair
              rows.push(
                <div key={`inline-${i}`} className="flex flex-row w-full items-stretch">
                  {/* Questions (left) */}
                  <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                    <div className="flex gap-4">
                      {/* First inline field */}
                      <div className="flex-1">
                        <label
                          className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                          htmlFor={`q-${i}`}
                        >
                          {currentQ.label}
                        </label>
                        {currentQ.type === 'select' ? (
                          <div className="relative w-full">
                            <select
                              id={`q-${i}`}
                              className={`w-full appearance-none px-3 py-2 rounded border outline-none transition focus:ring-2 pr-10 ${
                                darkMode
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                                  : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                              } ${activeIndex === i ? 'ring-2 ring-blue-400' : ''}`}
                              onFocus={() => setActiveIndex(i)}
                              onClick={() => setActiveIndex(i)}
                              value={getSelectValue(currentQ.label)}
                              onChange={e => handleSelectChange(currentQ.label, e.target.value)}
                            >
                              <option value="" disabled>
                                {currentQ.placeholder}
                              </option>
                              {currentQ.options && currentQ.options.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <ChevronDown
                              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
                              size={18}
                            />
                          </div>
                        ) : currentQ.type === 'readonly' ? (
                          <div>
                            <div className={`w-full px-3 py-2 rounded border ${
                              darkMode
                                ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                                : 'bg-gray-100 border-zinc-300 text-zinc-900'
                            }`}>
                              {currentQ.value}
                            </div>
                            {currentQ.label === "Total allocated" && !isAllocationComplete() && (
                              <div className="text-red-500 text-sm mt-1">
                                Funds allocation incomplete - please re-enter
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="relative w-full">
                            <input
                              id={`q-${i}`}
                              type={currentQ.type}
                              placeholder={currentQ.placeholder}
                              value={getInputValue(currentQ.label)}
                              onChange={(e) => handleInputChange(currentQ.label, e.target.value)}
                              min={currentQ.min}
                              max={currentQ.max}
                              step={currentQ.step}
                              className={`w-full px-3 py-2 rounded border outline-none transition focus:ring-2 ${
                                darkMode
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                                  : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                              } ${activeIndex === i ? 'ring-2 ring-blue-400' : ''} ${currentQ.suffix ? 'pr-8' : ''}`}
                              onFocus={() => setActiveIndex(i)}
                              onClick={() => setActiveIndex(i)}
                            />
                            {currentQ.suffix && (
                              <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                {currentQ.suffix}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Second inline field */}
                      <div className="flex-1">
                        <label
                          className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                          htmlFor={`q-${i + 1}`}
                        >
                          {nextQ.label}
                        </label>
                        {nextQ.type === 'select' ? (
                          <div className="relative w-full">
                            <select
                              id={`q-${i + 1}`}
                              className={`w-full appearance-none px-3 py-2 rounded border outline-none transition focus:ring-2 pr-10 ${
                                darkMode
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                                  : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                              } ${activeIndex === i + 1 ? 'ring-2 ring-blue-400' : ''}`}
                              onFocus={() => setActiveIndex(i + 1)}
                              onClick={() => setActiveIndex(i + 1)}
                              value={getSelectValue(nextQ.label)}
                              onChange={e => handleSelectChange(nextQ.label, e.target.value)}
                            >
                              <option value="" disabled>
                                {nextQ.placeholder}
                              </option>
                              {nextQ.options && nextQ.options.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <ChevronDown
                              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
                              size={18}
                            />
                          </div>
                        ) : nextQ.type === 'readonly' ? (
                          <div>
                            <div className={`w-full px-3 py-2 rounded border ${
                              darkMode
                                ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                                : 'bg-gray-100 border-zinc-300 text-zinc-900'
                            }`}>
                              {nextQ.value}
                            </div>
                            {nextQ.label === "Total allocated" && !isAllocationComplete() && (
                              <div className="text-red-500 text-sm mt-1">
                                Funds allocation incomplete - please re-enter
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="relative w-full">
                            <input
                              id={`q-${i + 1}`}
                              type={nextQ.type}
                              placeholder={nextQ.placeholder}
                              value={getInputValue(nextQ.label)}
                              onChange={(e) => handleInputChange(nextQ.label, e.target.value)}
                              min={nextQ.min}
                              max={nextQ.max}
                              step={nextQ.step}
                              className={`w-full px-3 py-2 rounded border outline-none transition focus:ring-2 ${
                                darkMode
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                                  : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                              } ${activeIndex === i + 1 ? 'ring-2 ring-blue-400' : ''} ${nextQ.suffix ? 'pr-8' : ''}`}
                              onFocus={() => setActiveIndex(i + 1)}
                              onClick={() => setActiveIndex(i + 1)}
                            />
                            {nextQ.suffix && (
                              <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                {nextQ.suffix}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
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
                  <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                    <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>
                      {recommendedPlanGuides[i]}
                    </span>
                  </div>
                </div>
              );
              i += 2; // Skip both questions
            } else {
              // Render single question
              const q = currentQ;
              rows.push(
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
                          htmlFor={`q-${i}`}
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
                        ) : q.type === 'select' ? (
                          <div className="relative w-full">
                            <select
                              id={`q-${i}`}
                              className={`w-full appearance-none px-3 py-2 rounded border outline-none transition focus:ring-2 pr-10 ${
                                darkMode
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                                  : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                              } ${activeIndex === i ? 'ring-2 ring-blue-400' : ''}`}
                              onFocus={() => setActiveIndex(i)}
                              onClick={() => setActiveIndex(i)}
                              value={getSelectValue(q.label)}
                              onChange={e => handleSelectChange(q.label, e.target.value)}
                            >
                              <option value="" disabled>
                                {q.placeholder}
                              </option>
                              {q.options && q.options.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <ChevronDown
                              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
                              size={18}
                            />
                          </div>
                        ) : q.type === 'readonly' ? (
                          <div>
                            <div className={`w-full px-3 py-2 rounded border ${
                              darkMode
                                ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                                : 'bg-gray-100 border-zinc-300 text-zinc-900'
                            }`}>
                              {q.value}
                            </div>
                            {q.label === "Total allocated" && !isAllocationComplete() && (
                              <div className="text-red-500 text-sm mt-1">
                                Funds allocation incomplete - please re-enter
                              </div>
                            )}
                          </div>
                        ) : q.type === 'textarea' ? (
                          <textarea
                            id={`q-${i}`}
                            rows={4}
                            placeholder={q.placeholder}
                            value={getInputValue(q.label)}
                            onChange={(e) => handleInputChange(q.label, e.target.value)}
                            className={`w-full px-3 py-2 rounded border outline-none transition focus:ring-2 resize-y ${
                              darkMode
                                ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                                : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                            } ${activeIndex === i ? 'ring-2 ring-blue-400' : ''}`}
                            onFocus={() => setActiveIndex(i)}
                            onClick={() => setActiveIndex(i)}
                          />
                        ) : q.type === 'button' ? (
                          <button
                            type="button"
                            className="px-4 py-2 rounded-lg text-sm font-medium transition border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            {q.label}
                          </button>
                        ) : (
                          <div className="relative w-full">
                            <input
                              id={`q-${i}`}
                              type={q.type}
                              placeholder={q.placeholder}
                              value={getInputValue(q.label)}
                              onChange={(e) => handleInputChange(q.label, e.target.value)}
                              min={q.min}
                              max={q.max}
                              step={q.step}
                              className={`w-full px-3 py-2 rounded border outline-none transition focus:ring-2 ${
                                darkMode
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                                  : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                              } ${activeIndex === i ? 'ring-2 ring-blue-400' : ''} ${q.suffix ? 'pr-8' : ''}`}
                              onFocus={() => setActiveIndex(i)}
                              onClick={() => setActiveIndex(i)}
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
                  <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                    <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>{recommendedPlanGuides[i]}</span>
                  </div>
                </div>
              );
              i += 1;
            }
          }
          
          return rows;
        })()}
      </div>
    </div>
  );
};

export default RecommendedPlanStage; 