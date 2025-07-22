import React, { useState, useEffect } from "react";
import BasicDetailsStage from './BasicDetailsStage';
import ExistingPlansStage from './ExistingPlansStage';
import RecommendedPlanStage from './RecommendedPlanStage';
import ResultsStage from './ResultsStage';

const baseQuestions = [
  { label: "Partner code", placeholder: "Enter partner code" },
  { label: "Partner name", placeholder: "Enter partner name" },
  { label: "Client's name", placeholder: "Enter client's name" },
  { label: "Client's Date of Birth", placeholder: "Enter client's date of birth" },
  { label: "Date of Birth to be used in calculation", placeholder: "Enter calculation date of birth" },
  { label: "Attitude to risk", placeholder: "Select attitude to risk", type: "select", options: ["High", "Upper medium", "Medium", "Lower medium", "Low"] },
];

const baseGuides = [
  "",
  "",
  "",
  "",
  "",
  "We may use the clients attitude to risk as a factor in the critical yield calculation",
];

const extraQuestion = { label: "Is the client considered to be an experienced or sophisticated investor?", placeholder: "Select yes or no", type: "radio", options: ["Yes", "No"] };
const essQuestion = {
  label: "Does the client have access to a Money Purchase Employer Sponsoured Scheme (ESS) that will allow transfers or redirection of regular contributions?",
  placeholder: "Select yes or no",
  type: "radio",
  options: ["Yes", "No"]
};
const extraGuide = "The definition for experienced or sophisticated investors can be found on the Advice framework on page 259";
const essGuide = "You should answer No if you are solely recommending the transfer of crystallised funds and the ESS is unable to accept crystallised benefits, as a comparison is not required in this scenario";
const crystallisedQuestion = {
  label: "Are you transfering crystallised funds or will funds be crystallised in the next 12 months as part of the advice?",
  placeholder: "Select yes or no",
  type: "radio",
  options: ["Yes", "No"]
};
const crystallisedGuide = "Answer yes if it applies to any plans in this calculation.";
const replaceEssQuestion = {
  label: "Are you replacing the ESS?",
  placeholder: "Select yes or no",
  type: "radio",
  options: ["Yes", "No"]
};
const essOnlyComparisonQuestion = {
  label: "Do you require an ESS only comparison?",
  placeholder: "Select yes or no",
  type: "radio",
  options: ["Yes", "No"]
};

const STAGES = [
  "Basic Details",
  "Existing Plans",
  "Recommended plan",
  "Results"
];

interface CYCFormProps {
  darkMode: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plan: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (plan: any, currentStage: number) => void;
  initialStage?: number;
}

export default function CYCForm({ darkMode, plan, onSave, initialStage = 0 }: CYCFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formState, setFormState] = useState<any>(plan);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentStage, setCurrentStage] = useState(initialStage);

  // Navigation function to handle stage changes
  const navigateToStage = (newStage: number) => {
    console.log('Navigating from stage', currentStage, 'to stage', newStage);
    setCurrentStage(newStage);
  };

  // Update formState on prop change
  useEffect(() => {
    setFormState(plan);
  }, [plan]);

  // Update currentStage when initialStage changes
  useEffect(() => {
    setCurrentStage(initialStage);
  }, [initialStage]);

  // Handle stage progression from flow manager
  useEffect(() => {
    if (initialStage > currentStage) {
      setCurrentStage(initialStage);
    }
  }, [initialStage, currentStage]); // Include currentStage to satisfy exhaustive-deps

  // Build the questions and guides in the correct order:
  const attitudeIdx = baseQuestions.findIndex(q => q.label === "Attitude to risk");
  const questions = [
    ...baseQuestions.slice(0, attitudeIdx),
    crystallisedQuestion,
    baseQuestions[attitudeIdx],
  ];
  const guides = [
    ...baseGuides.slice(0, attitudeIdx),
    crystallisedGuide,
    baseGuides[attitudeIdx],
  ];
  if (formState.attitudeValue === "Upper medium" || formState.attitudeValue === "High") {
    questions.push(extraQuestion);
    guides.push(extraGuide);
  }
  questions.push(essQuestion);
  guides.push(essGuide);
  // Insert the replace ESS question after the ESS question if user answered Yes
  let finalQuestions = [...questions];
  const essIdx = finalQuestions.findIndex(q => q.label === essQuestion.label);
  if (formState.essRadio === "Yes") {
    finalQuestions = [
      ...finalQuestions.slice(0, essIdx + 1),
      replaceEssQuestion,
      ...finalQuestions.slice(essIdx + 1)
    ];
    // Insert ESS only comparison question if user answers No to replace ESS
    const replaceIdx = finalQuestions.findIndex(q => q.label === replaceEssQuestion.label);
    if (formState.replaceEssRadio === "No") {
      finalQuestions = [
        ...finalQuestions.slice(0, replaceIdx + 1),
        essOnlyComparisonQuestion,
        ...finalQuestions.slice(replaceIdx + 1)
      ];
    }
  }
  finalQuestions = [
    ...finalQuestions,
    ...baseQuestions.slice(attitudeIdx + 1)
  ];

  // Stage content renderers
  function renderStageContent() {
    if (currentStage === 0) {
      return (
        <BasicDetailsStage
          darkMode={darkMode}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          attitudeValue={formState.attitudeValue}
          setAttitudeValue={value => setFormState({ ...formState, attitudeValue: value })}
          specialRadio={formState.specialRadio}
          setSpecialRadio={value => setFormState({ ...formState, specialRadio: value })}
          essRadio={formState.essRadio}
          setEssRadio={value => setFormState({ ...formState, essRadio: value })}
          crystallisedRadio={formState.crystallisedRadio}
          setCrystallisedRadio={value => setFormState({ ...formState, crystallisedRadio: value })}
          replaceEssRadio={formState.replaceEssRadio}
          setReplaceEssRadio={value => setFormState({ ...formState, replaceEssRadio: value })}
          essOnlyComparisonRadio={formState.essOnlyComparisonRadio}
          setEssOnlyComparisonRadio={value => setFormState({ ...formState, essOnlyComparisonRadio: value })}
        />
      );
    }
    if (currentStage === 1) {
      return (
        <ExistingPlansStage
          darkMode={darkMode}
          planCommenceDate={formState.planCommenceDate}
          setPlanCommenceDate={value => setFormState({ ...formState, planCommenceDate: value })}
          advisingPartnerRadio={formState.advisingPartnerRadio}
          setAdvisingPartnerRadio={value => setFormState({ ...formState, advisingPartnerRadio: value })}
          initialChargeRadio={formState.initialChargeRadio}
          setInitialChargeRadio={value => setFormState({ ...formState, initialChargeRadio: value })}
          initialChargeAmount={formState.initialChargeAmount}
          setInitialChargeAmount={value => setFormState({ ...formState, initialChargeAmount: value })}
          lumpSumTransferRadio={formState.lumpSumTransferRadio}
          setLumpSumTransferRadio={value => setFormState({ ...formState, lumpSumTransferRadio: value })}
          transferValue={formState.transferValue}
          setTransferValue={value => setFormState({ ...formState, transferValue: value })}
          benefitDate={formState.benefitDate}
          setBenefitDate={value => setFormState({ ...formState, benefitDate: value })}
          benefitAge={formState.benefitAge}
          setBenefitAge={value => setFormState({ ...formState, benefitAge: value })}
          trueCashRadio={formState.trueCashRadio}
          setTrueCashRadio={value => setFormState({ ...formState, trueCashRadio: value })}
          withProfitsRadio={formState.withProfitsRadio}
          setWithProfitsRadio={value => setFormState({ ...formState, withProfitsRadio: value })}
          ewcRadio={formState.ewcRadio}
          setEwcRadio={value => setFormState({ ...formState, ewcRadio: value })}
          ewcAmount={formState.ewcAmount}
          setEwcAmount={value => setFormState({ ...formState, ewcAmount: value })}
          ewcMonths={formState.ewcMonths}
          setEwcMonths={value => setFormState({ ...formState, ewcMonths: value })}
          ewcDate={formState.ewcDate}
          setEwcDate={value => setFormState({ ...formState, ewcDate: value })}
          mvaRadio={formState.mvaRadio}
          setMvaRadio={value => setFormState({ ...formState, mvaRadio: value })}
          loyaltyBonusRadio={formState.loyaltyBonusRadio}
          setLoyaltyBonusRadio={value => setFormState({ ...formState, loyaltyBonusRadio: value })}
          cycBasisRadio={formState.cycBasisRadio}
          setCycBasisRadio={value => setFormState({ ...formState, cycBasisRadio: value })}
          fundValueEqualsTransferValueRadio={formState.fundValueEqualsTransferValueRadio}
          setFundValueEqualsTransferValueRadio={value => setFormState({ ...formState, fundValueEqualsTransferValueRadio: value })}
          fundChargeDetails={formState.fundChargeDetails}
          setFundChargeDetails={value => setFormState({ ...formState, fundChargeDetails: value })}
          sameAnnualChargeRadio={formState.sameAnnualChargeRadio}
          setSameAnnualChargeRadio={value => setFormState({ ...formState, sameAnnualChargeRadio: value })}
          fundAnnualCharge={formState.fundAnnualCharge}
          setFundAnnualCharge={value => setFormState({ ...formState, fundAnnualCharge: value })}
          fixedChargeAmount={formState.fixedChargeAmount}
          setFixedChargeAmount={value => setFormState({ ...formState, fixedChargeAmount: value })}
          fixedChargeFrequency={formState.fixedChargeFrequency}
          setFixedChargeFrequency={value => setFormState({ ...formState, fixedChargeFrequency: value })}
          fixedChargeRadio={formState.fixedChargeRadio}
          setFixedChargeRadio={value => setFormState({ ...formState, fixedChargeRadio: value })}
        />
      );
    }
    if (currentStage === 2) {
      return (
        <RecommendedPlanStage
          darkMode={darkMode}
        />
      );
    }
    if (currentStage === 3) {
      return (
        <ResultsStage
          darkMode={darkMode}
        />
      );
    }
    return null;
  }

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full"
      style={{ background: darkMode ? '#18181b' : '#fff' }}
    >
      <div
        className={
          `border rounded-lg shadow-lg flex flex-col relative w-full min-h-0`
        }
        style={{
          width: '100%',
          height: '100%',
          background: darkMode ? '#18181b' : '#fff',
          borderColor: darkMode ? '#3f3f46' : '#e4e4e7',
          boxSizing: 'border-box',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
        }}
      >
        <div className="w-full h-full flex flex-col px-4">
          {/* Stepper */}
          <div className="flex flex-row w-full pt-8 pb-2 gap-4 items-center">
            {STAGES.map((stage, idx) => (
              <div
                key={stage}
                className={`flex-1 flex flex-col items-center cursor-pointer select-none ${idx === currentStage ? (darkMode ? 'font-bold text-blue-400' : 'font-bold text-blue-600') : (darkMode ? 'text-zinc-400' : 'text-zinc-400')}`}
                onClick={() => navigateToStage(idx)}
              >
                <div className={`rounded-full w-8 h-8 flex items-center justify-center mb-1 border-2 ${idx === currentStage
                  ? (darkMode ? 'border-blue-400 bg-zinc-800' : 'border-blue-600 bg-blue-50')
                  : (darkMode ? 'border-zinc-700 bg-zinc-900' : 'border-zinc-300 bg-zinc-100')
                }`}>{idx + 1}</div>
                <span className={`text-xs text-center ${darkMode ? (idx === currentStage ? 'text-blue-400' : 'text-zinc-400') : (idx === currentStage ? 'text-blue-600' : 'text-zinc-400')}`}>{stage}</span>
              </div>
            ))}
          </div>
          {/* Stage Content */}
          {renderStageContent()}

          {/* Additional Notes Section */}
          <div className="flex flex-row w-full items-stretch px-8 py-4 pt-8">
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
            <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
              <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Supporting notes requested while completing this page or that you belive will help clarify plan details should be written in this box - these will appear in output from this calculator.</span>
                          </div>
                          </div>
          {/* Navigation Buttons */}
          <div className="w-full flex justify-end items-center py-4 bg-inherit gap-2">
            {currentStage === 3 ? (
              // Results stage - show Save & Submit button only
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-normal bg-green-600 text-white transition border border-green-600 hover:bg-green-700 hover:border-green-700"
                onClick={() => {
                  // Save current form state and submit
                  onSave({ ...formState, complete: true }, currentStage);
                }}
              >
                Save & Submit
              </button>
            ) : (
              // Other stages - show Back and Save and Continue buttons
              <>
                <button
                  type="button"
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-normal transition border ${
                    currentStage === 0
                      ? 'text-zinc-400 dark:text-zinc-500 cursor-not-allowed opacity-50'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-500 cursor-pointer shadow-sm hover:shadow'
                  }`}
                  style={{
                    borderColor: darkMode ? '#52525b' : '#e4e4e7', // zinc-200 equivalent
                    backgroundColor: currentStage === 0 ? 'transparent' : (darkMode ? '#27272a' : '#fafafa'), // zinc-900 in dark, zinc-50 in light
                  }}
                  onClick={() => {
                    console.log('Back button clicked, currentStage:', currentStage);
                    // Navigate to previous stage
                    if (currentStage > 0) {
                      console.log('Navigating to stage:', currentStage - 1);
                      navigateToStage(currentStage - 1);
                    }
                  }}
                  disabled={currentStage === 0}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-normal bg-blue-600 text-white transition border border-blue-600 hover:bg-blue-700 hover:border-blue-700"
                  onClick={() => {
                    // Save current form state and let the flow manager handle navigation
                    onSave({ ...formState, complete: true }, currentStage);
                  }}
                >
                  Save and Continue
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}