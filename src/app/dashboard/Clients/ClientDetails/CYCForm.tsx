import React, { useState } from "react";
import BasicDetailsStage from './CYCForm/BasicDetailsStage';
import ExistingPlansStage from './CYCForm/ExistingPlansStage';

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
const essQuestion = { label: "Does the client have access to a Money Purchase Employer Sponsoured Scheme (ESS) that will allow transfers or redirection of regular contributions?", placeholder: "Select yes or no", type: "radio", options: ["Yes", "No"] };
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
  onBack?: () => void;
}

interface FundChargeDetail {
  name: string;
  value: string;
  charge: string;
}

export default function CYCForm({ darkMode, onBack }: CYCFormProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [attitudeValue, setAttitudeValue] = useState("");
  // removed unused extraValue, setExtraValue

  // Track radio values
  const [specialRadio, setSpecialRadio] = useState("");
  const [essRadio, setEssRadio] = useState("");
  const [crystallisedRadio, setCrystallisedRadio] = useState("");
  const [replaceEssRadio, setReplaceEssRadio] = useState("");
  const [essOnlyComparisonRadio, setEssOnlyComparisonRadio] = useState("");
  // Existing Plans stage: track plan commence date and special question
  const [planCommenceDate, setPlanCommenceDate] = useState("");
  const [advisingPartnerRadio, setAdvisingPartnerRadio] = useState("");
  // Track initial charge/remuneration radio and amount
  const [initialChargeRadio, setInitialChargeRadio] = useState("");
  const [initialChargeAmount, setInitialChargeAmount] = useState("");
  // Track lump sum transfer radio and value
  const [lumpSumTransferRadio, setLumpSumTransferRadio] = useState("");
  const [transferValue, setTransferValue] = useState("");
  // Track benefit date and age
  const [benefitDate, setBenefitDate] = useState("");
  const [benefitAge, setBenefitAge] = useState("");
  // Track true cash and with profits plan radios
  const [trueCashRadio, setTrueCashRadio] = useState("");
  const [withProfitsRadio, setWithProfitsRadio] = useState("");
  // Track EWC radio and special fields
  const [ewcRadio, setEwcRadio] = useState("");
  const [ewcAmount, setEwcAmount] = useState("");
  const [ewcMonths, setEwcMonths] = useState("");
  const [ewcDate, setEwcDate] = useState("");
  // Track MVA radio
  const [mvaRadio, setMvaRadio] = useState("");
  // Track Loyalty Bonus radio
  const [loyaltyBonusRadio, setLoyaltyBonusRadio] = useState("");
  // Track CYC basis radio
  const [cycBasisRadio, setCycBasisRadio] = useState("");
  // Add state for fundValueEqualsTransferValueRadio
  const [fundValueEqualsTransferValueRadio, setFundValueEqualsTransferValueRadio] = useState("");
  // Add state for fundChargeDetails
  const [fundChargeDetails, setFundChargeDetails] = useState<FundChargeDetail[]>([]);
  // Add state for sameAnnualChargeRadio
  const [sameAnnualChargeRadio, setSameAnnualChargeRadio] = useState("");
  // Add state for fundAnnualCharge
  const [fundAnnualCharge, setFundAnnualCharge] = useState("");
  // Add state for fixedChargeAmount and fixedChargeFrequency
  const [fixedChargeAmount, setFixedChargeAmount] = useState("");
  const [fixedChargeFrequency, setFixedChargeFrequency] = useState("");
  // Add state for fixedChargeRadio
  const [fixedChargeRadio, setFixedChargeRadio] = useState("");

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
  if (attitudeValue === "Upper medium" || attitudeValue === "High") {
    questions.push(extraQuestion);
    guides.push(extraGuide);
  }
  questions.push(essQuestion);
  guides.push(essGuide);
  // Insert the replace ESS question after the ESS question if user answered Yes
  let finalQuestions = [...questions];
  const essIdx = finalQuestions.findIndex(q => q.label === essQuestion.label);
  if (essRadio === "Yes") {
    finalQuestions = [
      ...finalQuestions.slice(0, essIdx + 1),
      replaceEssQuestion,
      ...finalQuestions.slice(essIdx + 1)
    ];
    // Insert ESS only comparison question if user answers No to replace ESS
    const replaceIdx = finalQuestions.findIndex(q => q.label === replaceEssQuestion.label);
    if (replaceEssRadio === "No") {
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
          attitudeValue={attitudeValue}
          setAttitudeValue={setAttitudeValue}
          specialRadio={specialRadio}
          setSpecialRadio={setSpecialRadio}
          essRadio={essRadio}
          setEssRadio={setEssRadio}
          crystallisedRadio={crystallisedRadio}
          setCrystallisedRadio={setCrystallisedRadio}
          replaceEssRadio={replaceEssRadio}
          setReplaceEssRadio={setReplaceEssRadio}
          essOnlyComparisonRadio={essOnlyComparisonRadio}
          setEssOnlyComparisonRadio={setEssOnlyComparisonRadio}
        />
      );
    }
    if (currentStage === 1) {
      return (
        <ExistingPlansStage
          darkMode={darkMode}
          planCommenceDate={planCommenceDate}
          setPlanCommenceDate={setPlanCommenceDate}
          advisingPartnerRadio={advisingPartnerRadio}
          setAdvisingPartnerRadio={setAdvisingPartnerRadio}
          initialChargeRadio={initialChargeRadio}
          setInitialChargeRadio={setInitialChargeRadio}
          initialChargeAmount={initialChargeAmount}
          setInitialChargeAmount={setInitialChargeAmount}
          lumpSumTransferRadio={lumpSumTransferRadio}
          setLumpSumTransferRadio={setLumpSumTransferRadio}
          transferValue={transferValue}
          setTransferValue={setTransferValue}
          benefitDate={benefitDate}
          setBenefitDate={setBenefitDate}
          benefitAge={benefitAge}
          setBenefitAge={setBenefitAge}
          trueCashRadio={trueCashRadio}
          setTrueCashRadio={setTrueCashRadio}
          withProfitsRadio={withProfitsRadio}
          setWithProfitsRadio={setWithProfitsRadio}
          ewcRadio={ewcRadio}
          setEwcRadio={setEwcRadio}
          ewcAmount={ewcAmount}
          setEwcAmount={setEwcAmount}
          ewcMonths={ewcMonths}
          setEwcMonths={setEwcMonths}
          ewcDate={ewcDate}
          setEwcDate={setEwcDate}
          mvaRadio={mvaRadio}
          setMvaRadio={setMvaRadio}
          loyaltyBonusRadio={loyaltyBonusRadio}
          setLoyaltyBonusRadio={setLoyaltyBonusRadio}
          cycBasisRadio={cycBasisRadio}
          setCycBasisRadio={setCycBasisRadio}
          fundValueEqualsTransferValueRadio={fundValueEqualsTransferValueRadio}
          setFundValueEqualsTransferValueRadio={setFundValueEqualsTransferValueRadio}
          fundChargeDetails={fundChargeDetails}
          setFundChargeDetails={setFundChargeDetails}
          sameAnnualChargeRadio={sameAnnualChargeRadio}
          setSameAnnualChargeRadio={setSameAnnualChargeRadio}
          fundAnnualCharge={fundAnnualCharge}
          setFundAnnualCharge={setFundAnnualCharge}
          fixedChargeAmount={fixedChargeAmount}
          setFixedChargeAmount={setFixedChargeAmount}
          fixedChargeFrequency={fixedChargeFrequency}
          setFixedChargeFrequency={setFixedChargeFrequency}
          fixedChargeRadio={fixedChargeRadio}
          setFixedChargeRadio={setFixedChargeRadio}
        />
      );
    }
    if (currentStage === 2) {
      return <div className="flex-1 flex items-center justify-center text-lg text-zinc-500">Investment Details Form (Stage 3)</div>;
    }
    if (currentStage === 3) {
      return <div className="flex-1 flex items-center justify-center text-lg text-zinc-500">Review & Submit (Stage 4)</div>;
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
          {onBack && (
            <div className="w-full flex justify-start pt-6">
              <button
                type="button"
                className="px-2.5 py-1.5 rounded border border-blue-600 bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition"
                style={{ minWidth: 0, lineHeight: 1.2 }}
                onClick={onBack}
              >
                ← Back
              </button>
            </div>
          )}
          {/* Stepper */}
          <div className="flex flex-row w-full pt-8 pb-2 gap-4 items-center">
            {STAGES.map((stage, idx) => (
              <div
                key={stage}
                className={`flex-1 flex flex-col items-center cursor-pointer select-none ${idx === currentStage ? (darkMode ? 'font-bold text-blue-400' : 'font-bold text-blue-600') : (darkMode ? 'text-zinc-400' : 'text-zinc-400')}`}
                onClick={() => setCurrentStage(idx)}
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
            {currentStage < STAGES.length - 1 ? (
              <>
                <button
                  type="button"
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-normal transition border border-zinc-200 dark:border-[var(--border)] ${darkMode ? 'bg-[var(--muted)] text-white' : 'bg-white text-zinc-700'}`}
                  style={{ minWidth: 0 }}
                  onClick={() => {/* Save logic here */}}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-normal bg-blue-600 text-white transition border border-blue-600 hover:bg-blue-700 hover:border-blue-700"
                  style={{ minWidth: 0 }}
                  onClick={() => setCurrentStage(s => Math.min(STAGES.length - 1, s + 1))}
                >
                  Save and Continue
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-normal transition border border-zinc-200 dark:border-[var(--border)] ${darkMode ? 'bg-[var(--muted)] text-white' : 'bg-white text-zinc-700'}`}
                  style={{ minWidth: 0 }}
                  onClick={() => {/* Save logic here */}}
                >
                  Save
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-normal bg-blue-600 text-white transition border border-blue-600 hover:bg-blue-700 hover:border-blue-700"
                  style={{ minWidth: 0 }}
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