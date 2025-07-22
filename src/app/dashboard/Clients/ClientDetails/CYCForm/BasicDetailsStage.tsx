import React from "react";
import { ChevronDown } from "lucide-react";

interface BasicDetailsStageProps {
  darkMode: boolean;
  activeIndex: number;
  setActiveIndex: (idx: number) => void;
  attitudeValue: string;
  setAttitudeValue: (val: string) => void;
  specialRadio: string;
  setSpecialRadio: (val: string) => void;
  essRadio: string;
  setEssRadio: (val: string) => void;
  crystallisedRadio: string;
  setCrystallisedRadio: (val: string) => void;
  replaceEssRadio: string;
  setReplaceEssRadio: (val: string) => void;
  essOnlyComparisonRadio: string;
  setEssOnlyComparisonRadio: (val: string) => void;
}

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
const replaceEssGuide =
  "If you are not replacing the ESS, enter the scheme details in the ESS section to allow a comparison to be run with the SJP plan, and detail the results in the Suitability Letter. If you are replacing the ESS and there is at least one other plan being replaced, enter the scheme details as both a plan to be replaced  and in the ESS section. If the ESS is the only plan being replaced, just enter the details as a plan to be replaced because a separate ESS comparison is not required in this scenrario";
const essOnlyComparisonQuestion = {
  label: "Do you require an ESS only comparison?",
  placeholder: "Select yes or no",
  type: "radio",
  options: ["Yes", "No"]
};
const essOnlyComparisonGuide =
  "You should select this option when the client has an ESS and you are recommending a new money contribution and where no plans are being replaced";

export default function BasicDetailsStage({
  darkMode,
  activeIndex,
  setActiveIndex,
  attitudeValue,
  setAttitudeValue,
  specialRadio,
  setSpecialRadio,
  essRadio,
  setEssRadio,
  crystallisedRadio,
  setCrystallisedRadio,
  replaceEssRadio,
  setReplaceEssRadio,
  essOnlyComparisonRadio,
  setEssOnlyComparisonRadio,
}: BasicDetailsStageProps) {
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
  let finalGuides = [...guides];
  const essIdx = finalQuestions.findIndex(q => q.label === essQuestion.label);
  if (essRadio === "Yes") {
    finalQuestions = [
      ...finalQuestions.slice(0, essIdx + 1),
      replaceEssQuestion,
      ...finalQuestions.slice(essIdx + 1)
    ];
    finalGuides = [
      ...finalGuides.slice(0, essIdx + 1),
      replaceEssGuide,
      ...finalGuides.slice(essIdx + 1)
    ];
    // Insert ESS only comparison question if user answers No to replace ESS
    const replaceIdx = finalQuestions.findIndex(q => q.label === replaceEssQuestion.label);
    if (replaceEssRadio === "No") {
      finalQuestions = [
        ...finalQuestions.slice(0, replaceIdx + 1),
        essOnlyComparisonQuestion,
        ...finalQuestions.slice(replaceIdx + 1)
      ];
      finalGuides = [
        ...finalGuides.slice(0, replaceIdx + 1),
        essOnlyComparisonGuide,
        ...finalGuides.slice(replaceIdx + 1)
      ];
    }
  }
  finalQuestions = [
    ...finalQuestions,
    ...baseQuestions.slice(attitudeIdx + 1)
  ];
  finalGuides = [
    ...finalGuides,
    ...baseGuides.slice(attitudeIdx + 1)
  ];

  return (
    <div className="flex-1 w-full flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto px-8 py-4 min-h-0">
        {finalQuestions.map((q, idx) => (
          <div key={q.label} className="flex flex-row w-full items-stretch">
            {/* Question (left) */}
            <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
              <label
                className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                htmlFor={`q-${idx}`}
              >
                {q.label}
              </label>
              {q.type === 'select' ? (
                <div className="relative w-full">
                  <select
                    id={`q-${idx}`}
                    className={`w-full appearance-none px-3 py-2 rounded border outline-none transition focus:ring-2 pr-10 ${
                      darkMode
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                        : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                    } ${activeIndex === idx ? 'ring-2 ring-blue-400' : ''}`}
                    onFocus={() => setActiveIndex(idx)}
                    onClick={() => setActiveIndex(idx)}
                    value={q.label === "Attitude to risk" ? attitudeValue : ""}
                    onChange={e => {
                      if (q.label === "Attitude to risk") {
                        setAttitudeValue(e.target.value);
                        setActiveIndex(idx);
                      }
                    }}
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
              ) : q.type === 'radio' ? (
                <div className="flex gap-6 mt-1">
                  {q.options.map(opt => (
                    <label key={opt} className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={q.label}
                        value={opt}
                        checked={q.label === extraQuestion.label
                          ? specialRadio === opt
                          : q.label === essQuestion.label
                            ? essRadio === opt
                            : q.label === crystallisedQuestion.label
                              ? crystallisedRadio === opt
                              : q.label === replaceEssQuestion.label
                                ? replaceEssRadio === opt
                                : q.label === essOnlyComparisonQuestion.label
                                  ? essOnlyComparisonRadio === opt
                                  : false}
                        onChange={e => {
                          if (q.label === extraQuestion.label) setSpecialRadio(e.target.value);
                          else if (q.label === essQuestion.label) setEssRadio(e.target.value);
                          else if (q.label === crystallisedQuestion.label) setCrystallisedRadio(e.target.value);
                          else if (q.label === replaceEssQuestion.label) setReplaceEssRadio(e.target.value);
                          else if (q.label === essOnlyComparisonQuestion.label) setEssOnlyComparisonRadio(e.target.value);
                        }}
                        className="accent-blue-600 w-4 h-4 mr-2"
                      />
                      <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  id={`q-${idx}`}
                  type={idx === 3 || idx === 4 ? "date" : "text"}
                  placeholder={q.placeholder}
                  className={`w-full px-3 py-2 rounded border outline-none transition focus:ring-2 ${
                    darkMode
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                      : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                  } ${activeIndex === idx ? 'ring-2 ring-blue-400' : ''}`}
                  onFocus={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(idx)}
                />
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
              <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>{finalGuides[idx]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 