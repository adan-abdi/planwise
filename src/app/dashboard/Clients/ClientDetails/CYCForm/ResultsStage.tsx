import React, { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";

interface ResultsStageProps {
  darkMode: boolean;
}

const ResultsStage: React.FC<ResultsStageProps> = ({ darkMode }) => {
  const [iacValue, setIacValue] = useState("0.00");
  const [maximiseIaf, setMaximiseIaf] = useState(true);
  const [maximiseCredit, setMaximiseCredit] = useState(false);

  const handleIacChange = (increment: number) => {
    const currentValue = parseFloat(iacValue);
    const newValue = Math.max(0, Math.min(4.5, currentValue + increment));
    setIacValue(newValue.toFixed(2));
  };

  return (
    <div className="flex-1 w-full flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto px-8 py-4 min-h-0">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
              Results
            </h1>
            <p className={`text-base ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
              Here are the results of your Critical Yield Calculation based on the information you provided.
            </p>
          </div>
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              darkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Close
          </button>
        </div>

        {/* Recommended Plan Section */}
        <div className={`mb-8 p-6 rounded-lg border ${
          darkMode 
            ? 'bg-green-900/20 border-green-700/30' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                darkMode ? 'bg-green-600' : 'bg-green-500'
              }`}>
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                  Recommended Plan: Retirement Account
                </h3>
                <p className={`text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  Details: Partner entitlement has been reduced to bring the CYC for this recommendation within allowable limits
                </p>
              </div>
            </div>
            <div className={`text-right ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
              <div className="text-sm font-medium mb-1">Transfer/fund value: £100,000.00</div>
              <div className="text-sm font-medium mb-1">New lump sum: £0.00</div>
              <div className="text-sm font-medium mb-1">Redirected Monthly: £0.00</div>
              <div className="text-sm font-medium">New regular: £0.00</div>
            </div>
          </div>
        </div>

        {/* Charges & Entitlements Section */}
        <div className="mb-8">
          <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
            Charges & entitlements
          </h2>
          <p className={`text-sm mb-6 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
            Where necessary, the Initial Advice Charge (IAC) has been adjusted to allow the replacement to proceed.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Lump sums */}
            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-100 border-gray-200'
            }`}>
              <h4 className={`font-medium mb-2 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                Lump sums
              </h4>
              <div className={`min-h-[60px] ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {/* Empty content */}
              </div>
            </div>

            {/* Initial Advice Charge (IAC) */}
            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-100 border-gray-200'
            }`}>
              <h4 className={`font-medium mb-2 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                Initial Advice Charge (IAC)
              </h4>
              <div className="space-y-2">
                <p className={`text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  IAC after any voluntary reduction
                </p>
                <p className={`text-sm ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                  Standard IAC: 4.50%
                </p>
                <p className={`text-sm ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                  IAC required to proceed: 0.00%
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => handleIacChange(-0.1)}
                    className={`w-8 h-8 rounded border flex items-center justify-center transition-colors ${
                      darkMode 
                        ? 'border-zinc-600 hover:bg-zinc-700 text-zinc-300' 
                        : 'border-gray-300 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className={`flex-1 px-3 py-2 rounded border text-center ${
                    darkMode 
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}>
                    {iacValue} %
                  </div>
                  <button
                    onClick={() => handleIacChange(0.1)}
                    className={`w-8 h-8 rounded border flex items-center justify-center transition-colors ${
                      darkMode 
                        ? 'border-zinc-600 hover:bg-zinc-700 text-zinc-300' 
                        : 'border-gray-300 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  (Use this to reduce your clients IAC further)
                </p>
              </div>
            </div>

            {/* Annual Management Charge (AMC) */}
            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-100 border-gray-200'
            }`}>
              <h4 className={`font-medium mb-2 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                Annual Management Charge (AMC)
              </h4>
              <p className={`text-sm ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                AMC: 0.90%
              </p>
            </div>

            {/* Initial Advice Fee (IAF) & Credit */}
            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-100 border-gray-200'
            }`}>
              <h4 className={`font-medium mb-2 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                Initial Advice Fee (IAF) & Credit
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={maximiseIaf}
                    onChange={() => setMaximiseIaf(true)}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <span className={`text-sm ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    IAF: 0.0%
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Maximise IAF
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={maximiseCredit}
                    onChange={() => setMaximiseCredit(true)}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <span className={`text-sm ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    Credit: 0.0%
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Maximise credit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results for each plan to be replaced Section */}
        <div>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
            Results for each plan to be replaced
          </h2>
          
          <div className={`p-6 rounded-lg border ${
            darkMode 
              ? 'bg-green-900/20 border-green-700/30' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-green-600' : 'bg-green-500'
                }`}>
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    Plan 1: Pass
                  </h3>
                  <p className={`text-sm mb-2 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    Reason: Projection/SRA
                  </p>
                  <div className={`text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    <div>Personal Pension</div>
                    <div>Aegon TK12589K</div>
                    <div>Transfer fund value: £100,000.00</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    darkMode 
                      ? 'bg-zinc-700 text-zinc-200 hover:bg-zinc-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Exclude Plan
                </button>
                <div className={`text-right text-sm ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                  <div className="mb-1">Level of outperformance required: 11.43%</div>
                  <div className="mb-1">Monetary equivalent in Year 1 (£): 11,428.51</div>
                  <div>Critical Yield Limit: 0.75%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsStage; 