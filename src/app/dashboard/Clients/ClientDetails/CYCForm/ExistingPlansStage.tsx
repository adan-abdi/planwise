import React from "react";
import { useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface FundChargeDetail {
  name: string;
  value: string;
  charge: string;
}

interface ExistingPlansStageProps {
  darkMode: boolean;
  planCommenceDate: string;
  setPlanCommenceDate: (val: string) => void;
  advisingPartnerRadio: string;
  setAdvisingPartnerRadio: (val: string) => void;
  initialChargeRadio: string;
  setInitialChargeRadio: (val: string) => void;
  initialChargeAmount: string;
  setInitialChargeAmount: (val: string) => void;
  lumpSumTransferRadio: string;
  setLumpSumTransferRadio: (val: string) => void;
  transferValue: string;
  setTransferValue: (val: string) => void;
  benefitDate: string;
  setBenefitDate: (val: string) => void;
  benefitAge: string;
  setBenefitAge: (val: string) => void;
  trueCashRadio: string;
  setTrueCashRadio: (val: string) => void;
  withProfitsRadio: string;
  setWithProfitsRadio: (val: string) => void;
  ewcRadio: string;
  setEwcRadio: (val: string) => void;
  ewcAmount: string;
  setEwcAmount: (val: string) => void;
  ewcMonths: string;
  setEwcMonths: (val: string) => void;
  ewcDate: string;
  setEwcDate: (val: string) => void;
  mvaRadio: string;
  setMvaRadio: (val: string) => void;
  loyaltyBonusRadio: string;
  setLoyaltyBonusRadio: (val: string) => void;
  cycBasisRadio: string;
  setCycBasisRadio: (val: string) => void;
  fundValueEqualsTransferValueRadio: string;
  setFundValueEqualsTransferValueRadio: (val: string) => void;
  fundChargeDetails: FundChargeDetail[];
  setFundChargeDetails: (details: FundChargeDetail[]) => void;
  sameAnnualChargeRadio: string;
  setSameAnnualChargeRadio: (val: string) => void;
  fundAnnualCharge: string;
  setFundAnnualCharge: (val: string) => void;
  fixedChargeAmount: string;
  setFixedChargeAmount: (val: string) => void;
  fixedChargeFrequency: string;
  setFixedChargeFrequency: (val: string) => void;
  fixedChargeRadio: string;
  setFixedChargeRadio: (val: string) => void;
}

export default function ExistingPlansStage({
  darkMode,
  planCommenceDate,
  setPlanCommenceDate,
  advisingPartnerRadio,
  setAdvisingPartnerRadio,
  initialChargeRadio,
  setInitialChargeRadio,
  initialChargeAmount,
  setInitialChargeAmount,
  lumpSumTransferRadio,
  setLumpSumTransferRadio,
  transferValue,
  setTransferValue,
  benefitDate,
  setBenefitDate,
  benefitAge,
  setBenefitAge,
  trueCashRadio,
  setTrueCashRadio,
  withProfitsRadio,
  setWithProfitsRadio,
  ewcRadio,
  setEwcRadio,
  ewcAmount,
  setEwcAmount,
  ewcMonths,
  setEwcMonths,
  ewcDate,
  setEwcDate,
  mvaRadio,
  setMvaRadio,
  loyaltyBonusRadio,
  setLoyaltyBonusRadio,
  cycBasisRadio,
  setCycBasisRadio,
  fundValueEqualsTransferValueRadio,
  setFundValueEqualsTransferValueRadio,
  fundChargeDetails,
  setFundChargeDetails,
  sameAnnualChargeRadio,
  setSameAnnualChargeRadio,
  fundAnnualCharge,
  setFundAnnualCharge,
  fixedChargeAmount,
  setFixedChargeAmount,
  fixedChargeFrequency,
  setFixedChargeFrequency,
  fixedChargeRadio,
  setFixedChargeRadio,
}: ExistingPlansStageProps) {
  useEffect(() => {
    if (!fundChargeDetails || fundChargeDetails.length === 0) {
      setFundChargeDetails([{ name: '', value: '', charge: '' }]);
    }
  }, [fundChargeDetails, setFundChargeDetails]);

  return (
    <>
            <div className="flex-1 w-full flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-8 py-4 min-h-0">
            {/* Plan name */}
            <div className="flex flex-row w-full items-stretch">
              {/* Question (left) */}
              <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                <label
                  className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                  htmlFor="plan-name"
                >
                  Plan name
                </label>
                <input
                  id="plan-name"
                  type="text"
                  placeholder="Enter plan name"
                  className={`w-full px-3 py-2 rounded border outline-none transition focus:ring-2 ${
                    darkMode
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                      : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                  }`}
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
              {/* Guide (right) - empty for this question */}
              <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}></span>
              </div>
            </div>
            {/* Plan provider */}
            <div className="flex flex-row w-full items-stretch mt-2">
              {/* Question (left) */}
              <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                <label
                  className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                  htmlFor="plan-provider"
                >
                  Plan provider
                </label>
                <input
                  id="plan-provider"
                  type="text"
                  placeholder="Start typing provider name..."
                  className={`w-full px-3 py-2 rounded border outline-none transition focus:ring-2 ${
                    darkMode
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                      : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                  }`}
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
                <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Start typing the existing providers name (For example Standard Life) and a list of providers to select from will appear. If no option is presented, please type and select &quot;Other&quot; then confirm the provider name within the Additional Notes section below</span>
              </div>
            </div>
            {/* Plan number */}
            <div className="flex flex-row w-full items-stretch mt-2">
              {/* Question (left) */}
              <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                <label
                  className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                  htmlFor="plan-number"
                >
                  Plan Number
                </label>
                <input
                  id="plan-number"
                  type="text"
                  placeholder="Enter plan number"
                  className={`w-full px-3 py-2 rounded border outline-none transition focus:ring-2 ${
                    darkMode
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                      : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                  }`}
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
              {/* Guide (right) - empty for this question */}
              <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}></span>
              </div>
            </div>
            {/* Plan commence date */}
            <div className="flex flex-row w-full items-stretch mt-2">
              {/* Question (left) */}
              <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                <label
                  className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                  htmlFor="plan-commence-date"
                >
                  When did the plan commence?
                </label>
                <input
                  id="plan-commence-date"
                  type="date"
                  className={`w-full px-3 py-2 rounded border outline-none transition focus:ring-2 ${
                    darkMode
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                      : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                  }`}
                  value={planCommenceDate}
                  onChange={e => setPlanCommenceDate(e.target.value)}
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
              {/* Guide (right) - empty for this question */}
              <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}></span>
              </div>
            </div>
            {/* Special question: Did the advising partner or an associate set up this plan? */}
            {(() => {
              if (!planCommenceDate) return null;
              const selectedDate = new Date(planCommenceDate);
              const now = new Date();
              const threeYearsAgo = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
              if (selectedDate > threeYearsAgo) {
                return (
                  <div className="flex flex-row w-full items-stretch mt-2">
                    {/* Question (left) */}
                    <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                      <label
                        className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                        htmlFor="advising-partner"
                      >
                        Did the advising partner or an associate set up this plan?
                      </label>
                      <div className="flex gap-6 mt-1">
                        {['Yes', 'No'].map(opt => (
                          <label key={opt} className="inline-flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="advising-partner"
                              value={opt}
                              checked={advisingPartnerRadio === opt}
                              onChange={e => setAdvisingPartnerRadio(e.target.value)}
                              className="accent-blue-600 w-4 h-4 mr-2"
                            />
                            <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                          </label>
                        ))}
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
                    {/* Guide (right) - empty for this question */}
                    <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                      <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}></span>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
            {/* Initial charge or remuneration question */}
            <div className="flex flex-row w-full items-stretch mt-2">
              {/* Question (left) */}
              <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                <label
                  className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                  htmlFor="initial-charge-remuneration"
                >
                  Has either an initial charge or any form of financial remuneration been taken on a lump sum investment which will impact the calculation?
                </label>
                <div className="flex gap-6 mt-1">
                  {['Yes', 'No'].map(opt => (
                    <label key={opt} className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="initial-charge-remuneration"
                        value={opt}
                        checked={initialChargeRadio === opt}
                        onChange={e => setInitialChargeRadio(e.target.value)}
                        className="accent-blue-600 w-4 h-4 mr-2"
                      />
                      <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                    </label>
                  ))}
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
                <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>There is an impact on the calculation if any initial charges or financial remuneration ave been taken in the last 3 years, even if the plan started more than 3 years ago</span>
              </div>
            </div>
            {/* Special question: Amount of initial charge/financial remuneration */}
            {initialChargeRadio === 'Yes' && (
              <div className="flex flex-row w-full items-stretch mt-2">
                {/* Question (left) */}
                <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                  <label
                    className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                    htmlFor="initial-charge-amount"
                  >
                    Amount of initial charge/financial remuneration
                  </label>
                  <div className="relative w-full">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-zinc-300' : 'text-zinc-500'}`}>£</span>
                    <input
                      id="initial-charge-amount"
                      type="text"
                      inputMode="decimal"
                      pattern="^\\d*(\\.\\d{0,2})?$"
                      min="0"
                      step="any"
                      placeholder="Enter amount"
                      value={initialChargeAmount}
                      onChange={e => {
                        // Only allow numbers and decimal point
                        const val = e.target.value.replace(/[^\d.]/g, '');
                        setInitialChargeAmount(val);
                      }}
                      className={`w-full pl-7 pr-3 py-2 rounded border outline-none transition focus:ring-2 ${
                        darkMode
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                          : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                      }`}
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    />
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
                  <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Enter here the total of all initial charges and financial remuneration paid in the last 3 years. IAC payable on the new plan might be reduced to cover this amount</span>
                </div>
              </div>
            )}
            {/* Lump sum transfer question */}
            <div className="flex flex-row w-full items-stretch mt-2">
              {/* Question (left) */}
              <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                <label
                  className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                  htmlFor="lump-sum-transfer"
                >
                  Is a lump sum from this plan being transferred to the recommended plan?
                </label>
                <div className="flex gap-6 mt-1">
                  {['Yes', 'No'].map(opt => (
                    <label key={opt} className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="lump-sum-transfer"
                        value={opt}
                        checked={lumpSumTransferRadio === opt}
                        onChange={e => setLumpSumTransferRadio(e.target.value)}
                        className="accent-blue-600 w-4 h-4 mr-2"
                      />
                      <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                    </label>
                  ))}
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
                <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>This includes a partial or full transfer of value</span>
              </div>
            </div>
            {/* Special question: Current Fund value or Transfer value */}
            {lumpSumTransferRadio === 'Yes' && (
              <>
                <div className="flex flex-row w-full items-stretch mt-2">
                  {/* Question (left) */}
                  <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                    <label
                      className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                      htmlFor="transfer-value"
                    >
                      Current Fund value or Transfer value
                    </label>
                    <div className="relative w-full">
                      <span className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-zinc-300' : 'text-zinc-500'}`}>£</span>
                      <input
                        id="transfer-value"
                        type="text"
                        inputMode="decimal"
                        pattern="^\\d*(\\.\\d{0,2})?$"
                        min="0"
                        step="any"
                        placeholder="Enter value"
                        value={transferValue}
                        onChange={e => {
                          // Only allow numbers and decimal point
                          const val = e.target.value.replace(/[^\d.]/g, '');
                          setTransferValue(val);
                        }}
                        className={`w-full pl-7 pr-3 py-2 rounded border outline-none transition focus:ring-2 ${
                          darkMode
                            ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                            : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                        }`}
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      />
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
                  {/* Guide (right) with hyperlink */}
                  <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                    <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>For help with this field, see the{' '}
                      <a
                        href="https://example.com/transfer-value-factsheet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={darkMode ? 'text-blue-400 underline' : 'text-blue-600 underline'}
                      >
                        Transfer Value factsheet
                      </a>
                    </span>
                  </div>
                </div>
                {/* Special question: Is the plan invested in true cash? */}
                <div className="flex flex-row w-full items-stretch mt-2">
                  {/* Question (left) */}
                  <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                    <label
                      className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                      htmlFor="true-cash"
                    >
                      Is the plan invested in true cash?
                    </label>
                    <div className="flex gap-6 mt-1">
                      {['Yes', 'No'].map(opt => (
                        <label key={opt} className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="true-cash"
                            value={opt}
                            checked={trueCashRadio === opt}
                            onChange={e => setTrueCashRadio(e.target.value)}
                            className="accent-blue-600 w-4 h-4 mr-2"
                          />
                          <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                        </label>
                      ))}
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
                    <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>An example of true cash is a SIPP bank account. An example of something not classed as true cash is a pooled investment uch as a money market fund. Please see page 259 of the advice framework for more information on testing cash. Please note answering Yes to this question will result in the cash element being run with no limit applied. If the plan is split between true cash and other funds, ou are required to treat these as two separate plans for the purpose of the calculation .</span>
                  </div>
                </div>
                {/* Special question: With profits plan with implicit charges */}
                {trueCashRadio === 'No' && (
                  <div className="flex flex-row w-full items-stretch mt-2">
                    {/* Question (left) */}
                    <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                      <label
                        className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                        htmlFor="with-profits-implicit-charges"
                      >
                        Is this a With profits plan with implicit charges where no projections are available?
                      </label>
                      <div className="flex gap-6 mt-1">
                        {['Yes', 'No'].map(opt => (
                          <label key={opt} className="inline-flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="with-profits-implicit-charges"
                              value={opt}
                              checked={withProfitsRadio === opt}
                              onChange={e => setWithProfitsRadio(e.target.value)}
                              className="accent-blue-600 w-4 h-4 mr-2"
                            />
                            <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                          </label>
                        ))}
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
                    {/* Guide (right) with line break */}
                    <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                      <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Please note that if you answer Yes to this question this plan will be run without a limit being applied<br/>Please note that if the With Profits PPFM provides an indication of charges, then a charges comparison with a limit can be done, and you can select No to this question. See page 259 of the Advice Framework for more information</span>
                    </div>
                  </div>
                )}
              </>
            )}
            {/* When does the client want to take benefits */}
            <div className="flex flex-row w-full items-stretch mt-2">
              {/* Question (left) */}
              <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                <label
                  className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                  htmlFor="benefit-date"
                >
                  When does the client want to take benefits
                </label>
                <div className="flex flex-row gap-4 items-center w-full">
                  <input
                    id="benefit-date"
                    type="date"
                    value={benefitDate}
                    onChange={e => setBenefitDate(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded border outline-none transition focus:ring-2 ${
                      darkMode
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                        : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                    }`}
                  />
                  <input
                    id="benefit-age"
                    type="number"
                    min="0"
                    step="1"
                    value={benefitAge}
                    onChange={e => setBenefitAge(e.target.value)}
                    className={`w-24 px-3 py-2 rounded border outline-none transition focus:ring-2 ${
                      darkMode
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                        : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                    }`}
                    placeholder="Age"
                  />
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
              {/* Guide (right) - empty for this question */}
              <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}></span>
              </div>
            </div>
            {/* Regular contributions question */}
            <div className="flex flex-row w-full items-stretch mt-2">
              {/* Question (left) */}
              <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                <label
                  className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                  htmlFor="regular-contributions"
                >
                  Is the plan currently receiving regular contributions or have regular contributions ceased within the six months prior to the first client meeting?
                </label>
                <div className="flex gap-6 mt-1">
                  {['Yes', 'No'].map(opt => (
                    <label key={opt} className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="regular-contributions"
                        value={opt}
                        className="accent-blue-600 w-4 h-4 mr-2"
                      />
                      <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                    </label>
                  ))}
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
                <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>A test on the regular contributions may still be required even if they have already ceased or about to do so</span>
              </div>
            </div>
            {/* Ongoing advice available question */}
            <div className="flex flex-row w-full items-stretch mt-2">
              {/* Question (left) */}
              <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                <label
                  className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                  htmlFor="ongoing-advice"
                >
                  Is ongoing advice available to the client?
                </label>
                <div className="flex gap-6 mt-1">
                  {['Yes', 'No'].map(opt => (
                    <label key={opt} className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="ongoing-advice"
                        value={opt}
                        className="accent-blue-600 w-4 h-4 mr-2"
                      />
                      <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                    </label>
                  ))}
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
                <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Enter Yes where advice is available from the clients existing advisors or IFA office. Examples of when advice is considered to be available are given on page 259 of the Advice Framework</span>
              </div>
            </div>
            {/* Withdrawal Charges and Loyalty Bonuses Section */}
            {lumpSumTransferRadio === 'Yes' && (
              <div className="w-full mt-8">
                <div className={`text-lg font-semibold mb-4 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Withdrawal Charges and Loyalty Bonuses</div>
                {/* EWC question */}
                <div className="flex flex-row w-full items-stretch mt-2">
                  <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                    <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Does the plan have an Early Withdrawal Charge (EWC)</label>
                    <div className="flex gap-6 mt-1">
                      {['Yes', 'No'].map(opt => (
                        <label key={opt} className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="ewc"
                            value={opt}
                            checked={ewcRadio === opt}
                            onChange={() => setEwcRadio(opt)}
                            className="accent-blue-600 w-4 h-4 mr-2"
                          />
                          <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                  <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                    <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}></span>
                  </div>
                </div>
                {/* Special questions for EWC Yes - grouped block */}
                {ewcRadio === 'Yes' && (
                  <div>
                    {/* EWC amount */}
                    <div className="flex flex-row w-full items-stretch mt-2">
                      <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                        <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>EWC amount</label>
                        <div className="relative w-full">
                          <span className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-zinc-300' : 'text-zinc-500'}`}>£</span>
                          <input
                            type="text"
                            inputMode="decimal"
                            pattern="^\\d*(\\.\\d{0,2})?$"
                            min="0"
                            step="any"
                            placeholder="Enter amount"
                            value={ewcAmount}
                            onChange={e => {
                              const val = e.target.value.replace(/[^\d.]/g, '');
                              setEwcAmount(val);
                            }}
                            className={`w-full pl-7 pr-3 py-2 rounded border outline-none transition focus:ring-2 ${
                              darkMode
                                ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                                : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                            }`}
                            style={{ fontVariantNumeric: 'tabular-nums' }}
                          />
                        </div>
                      </div>
                      <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                      <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                        <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>See guidance on <a href="https://example.com/how-to-enter-ewcs" target="_blank" rel="noopener noreferrer" className={darkMode ? 'text-blue-400 underline' : 'text-blue-600 underline'}>How to enter EWCs</a></span>
                      </div>
                    </div>
                    {/* Months until no EWC applies & Date no EWC applies (same row) */}
                    <div className="flex flex-row w-full items-stretch mt-2">
                      <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                        <div className="flex flex-row gap-4 items-end">
                          <div className="flex flex-col">
                            <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Months until no EWC applies</label>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              placeholder="Months"
                              value={ewcMonths}
                              onChange={e => setEwcMonths(e.target.value)}
                              className={`w-24 px-3 py-2 rounded border outline-none transition focus:ring-2 ${
                                darkMode
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                                  : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                              }`}
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Date no EWC applies</label>
                            <input
                              type="date"
                              value={ewcDate}
                              onChange={e => setEwcDate(e.target.value)}
                              className={`w-36 px-3 py-2 rounded border outline-none transition focus:ring-2 ${
                                darkMode
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                                  : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Divider */}
                      <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                      {/* Guide (right) */}
                      <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                        <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>If the EWC is on a sliding scale, enter the number of months until there is no EWC</span>
                      </div>
                    </div>
                  </div>
                )}
                {/* MVA question */}
                <div className="flex flex-row w-full items-stretch mt-2">
                  <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                    <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Does a Market Value Adjustment (MVA) currently apply to this plan?</label>
                    <div className="flex gap-6 mt-1">
                      {['Yes', 'No'].map(opt => (
                        <label key={opt} className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="mva"
                            value={opt}
                            checked={mvaRadio === opt}
                            onChange={() => setMvaRadio(opt)}
                            className="accent-blue-600 w-4 h-4 mr-2"
                          />
                          <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                  <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                    <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}></span>
                  </div>
                </div>
                {/* Special questions for MVA Yes - grouped block */}
                {mvaRadio === 'Yes' && (
                  <div>
                    {/* MVA amount */}
                    <div className="flex flex-row w-full items-stretch mt-2">
                      <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                        <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Market Value Adjustment(MVA)</label>
                        <div className="relative w-full">
                          <span className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-zinc-300' : 'text-zinc-500'}`}>£</span>
                          <input
                            type="text"
                            inputMode="decimal"
                            pattern="^\\d*(\\.\\d{0,2})?$"
                            min="0"
                            step="any"
                            placeholder="Enter amount"
                            value={ewcAmount}
                            onChange={e => {
                              const val = e.target.value.replace(/[^\d.]/g, '');
                              setEwcAmount(val);
                            }}
                            className={`w-full pl-7 pr-3 py-2 rounded border outline-none transition focus:ring-2 ${
                              darkMode
                                ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                                : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                            }`}
                            style={{ fontVariantNumeric: 'tabular-nums' }}
                          />
                        </div>
                      </div>
                      <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                      <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                        <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>See guidance on <a href="https://example.com/how-to-enter-mva" target="_blank" rel="noopener noreferrer" className={darkMode ? 'text-blue-400 underline' : 'text-blue-600 underline'}>How to enter MVAs</a></span>
                      </div>
                    </div>
                    {/* Months until no MVA applies & Date no MVA applies (same row) */}
                    <div className="flex flex-row w-full items-stretch mt-2">
                      <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                        <div className="flex flex-row gap-4 items-end">
                          <div className="flex flex-col">
                            <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Months until no MVA applies</label>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              placeholder="Months"
                              value={ewcMonths}
                              onChange={e => setEwcMonths(e.target.value)}
                              className={`w-24 px-3 py-2 rounded border outline-none transition focus:ring-2 ${
                                darkMode
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                                  : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                              }`}
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Date no MVA applies</label>
                            <input
                              type="date"
                              value={ewcDate}
                              onChange={e => setEwcDate(e.target.value)}
                              className={`w-36 px-3 py-2 rounded border outline-none transition focus:ring-2 ${
                                darkMode
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                                  : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Divider */}
                      <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                      {/* Guide (right) */}
                      <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                        <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>If the MVA is on a sliding scale, enter the number of months until there is no MVA</span>
                      </div>
                    </div>
                  </div>
                )}
                {/* Loyalty bonuses question */}
                <div className="flex flex-row w-full items-stretch mt-2">
                  <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                    <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Does the plan have any Loyalty bonuses?</label>
                    <div className="flex gap-6 mt-1">
                      {['Yes', 'No'].map(opt => (
                        <label key={opt} className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="loyalty-bonus"
                            value={opt}
                            checked={loyaltyBonusRadio === opt}
                            onChange={() => setLoyaltyBonusRadio(opt)}
                            className="accent-blue-600 w-4 h-4 mr-2"
                          />
                          <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                  <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                    <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Please answer No if using a Projections basis OR if bonuses are disretionary</span>
                  </div>
                </div>
                {/* Special questions for Loyalty Bonus Yes - grouped block */}
                {loyaltyBonusRadio === 'Yes' && (
                  <div>
                    {/* Loyalty bonus percentage */}
                    <div className="flex flex-row w-full items-stretch mt-2">
                      <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                        <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Loyalty bonus</label>
                        <div className="relative w-full">
                          <input
                            type="text"
                            inputMode="decimal"
                            pattern="^\\d*(\\.\\d{0,2})?$"
                            min="0"
                            step="any"
                            placeholder="Enter percentage"
                            value={ewcAmount}
                            onChange={e => {
                              const val = e.target.value.replace(/[^\d.]/g, '');
                              setEwcAmount(val);
                            }}
                            className={`w-full pr-7 pl-3 py-2 rounded border outline-none transition focus:ring-2 ${
                              darkMode
                                ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                                : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                            }`}
                            style={{ fontVariantNumeric: 'tabular-nums' }}
                          />
                          <span className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-zinc-300' : 'text-zinc-500'}`}>%</span>
                        </div>
                      </div>
                      <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                      <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                        <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Enter the percentage of the loyalty bonus if known, or leave blank if not applicable.</span>
                      </div>
                    </div>
                    {/* Months until no loyalty bonus applies & Date no loyalty bonus applies (same row) */}
                    <div className="flex flex-row w-full items-stretch mt-2">
                      <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                        <div className="flex flex-row gap-4 items-end">
                          <div className="flex flex-col">
                            <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Months until loyalty bonus becomes payable</label>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              placeholder="Months"
                              value={ewcMonths}
                              onChange={e => setEwcMonths(e.target.value)}
                              className={`w-24 px-3 py-2 rounded border outline-none transition focus:ring-2 ${
                                darkMode
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                                  : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                              }`}
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Date Loyalty bonus becomes payable</label>
                            <input
                              type="date"
                              value={ewcDate}
                              onChange={e => setEwcDate(e.target.value)}
                              className={`w-36 px-3 py-2 rounded border outline-none transition focus:ring-2 ${
                                darkMode
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                                  : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Divider */}
                      <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                      {/* Guide (right) */}
                      <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                        <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>If the loyalty bonus is on a sliding scale, enter the number of months until there is no loyalty bonus</span>
                      </div>
                    </div>
                  </div>
                )}
                {/* Lifestyling question */}
                <div className="flex flex-row w-full items-stretch mt-2">
                  <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                    <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Does the projection include lifestyling</label>
                    <div className="flex gap-6 mt-1">
                      {['Yes', 'No'].map(opt => (
                        <label key={opt} className="inline-flex items-center cursor-pointer">
                          <input type="radio" name="lifestyling" value={opt} className="accent-blue-600 w-4 h-4 mr-2" />
                          <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                  <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                    <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Please <a href="https://example.com/api-169-guidance" target="_blank" rel="noopener noreferrer" className={darkMode ? 'text-blue-400 underline' : 'text-blue-600 underline'}>click here</a> for guidance on when to use projections or charges in API 169</span>
                  </div>
                </div>
                {/* Basis for CYC calculation question */}
                <div className="flex flex-row w-full items-stretch mt-2">
                  <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                    <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>What basis are you using for this CYC calculation?</label>
                    <div className="flex gap-6 mt-1">
                      {['Projection', 'Plan charges'].map(opt => (
                        <label key={opt} className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="cyc-basis"
                            value={opt}
                            checked={cycBasisRadio === opt}
                            onChange={e => setCycBasisRadio(e.target.value)}
                            className="accent-blue-600 w-4 h-4 mr-2"
                          />
                          <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                  <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                    <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>We expect a charges basis to be used for most comparisons. For plans containing a loyalty bonus, with profits guarantees implicit or complex charges, then projections should be used. Please refer to the Pensions CYC toolkit for further guidance.</span>
                  </div>
                </div>
                {/* Projection Basis Section */}
                {cycBasisRadio === 'Projection' && (
                  <div className="mt-2">
                    <div className={`text-lg font-semibold mb-4 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Projection Basis</div>
                    {/* Q1: Projected value */}
                    <div className="flex flex-row w-full items-stretch mt-2">
                      <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                        <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Projected value</label>
                        <div className="relative w-full">
                          <span className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-zinc-300' : 'text-zinc-500'}`}>£</span>
                          <input
                            type="text"
                            inputMode="decimal"
                            pattern="^\\d*(\\.\\d{0,2})?$"
                            min="0"
                            step="any"
                            placeholder="Enter value"
                            className={`w-full pl-7 pr-3 py-2 rounded border outline-none transition focus:ring-2 ${
                              darkMode
                                ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500'
                                : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'
                            }`}
                            style={{ fontVariantNumeric: 'tabular-nums' }}
                          />
                        </div>
                      </div>
                      <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                      <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                        <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>If plan contains a guaranteed annuity rate (GAR) read <a href="https://example.com/ba237" target="_blank" rel="noopener noreferrer" className={darkMode ? 'text-blue-400 underline' : 'text-blue-600 underline'}>BA237</a>. If plan was issued by Met life, read <a href="https://example.com/ba422" target="_blank" rel="noopener noreferrer" className={darkMode ? 'text-blue-400 underline' : 'text-blue-600 underline'}>BA422</a></span>
                      </div>
                    </div>
                    {/* Q2: Has this value been reduced for inflation? */}
                    <div className="flex flex-row w-full items-stretch mt-2">
                      <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                        <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Has this value been reduced for inflation?</label>
                        <div className="flex gap-6 mt-1">
                          {['Yes', 'No'].map(opt => (
                            <label key={opt} className="inline-flex items-center cursor-pointer">
                              <input type="radio" name="proj-inflation" value={opt} className="accent-blue-600 w-4 h-4 mr-2" />
                              <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                      <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                        <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Please check the ceding plans projections - in some rare cases (e.g. legacy companies) this will be No</span>
                      </div>
                    </div>
                    {/* Q3: Do all funds have the same annual growth? */}
                    <div className="flex flex-row w-full items-stretch mt-2">
                      <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                        <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Do all funds have the same annual growth?</label>
                        <div className="flex gap-6 mt-1">
                          {['Yes', 'No'].map(opt => (
                            <label key={opt} className="inline-flex items-center cursor-pointer">
                              <input type="radio" name="proj-growth" value={opt} className="accent-blue-600 w-4 h-4 mr-2" />
                              <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                      <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                        <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}></span>
                      </div>
                    </div>
                    {/* Q4: Projection Start Date */}
                    <div className="flex flex-row w-full items-stretch mt-2">
                      <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                        <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Projection Start Date</label>
                        <input type="date" className={`w-full px-3 py-2 rounded border outline-none transition focus:ring-2 ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500' : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'}`} />
                      </div>
                      <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                      <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                        <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>The date the projection was created should be within the last 6 months. The transfer value and projection should be dated within 5 days of each other</span>
                      </div>
                    </div>
                    {/* Q5/Q6: Projection end date & Or Age at projection date */}
                    <div className="flex flex-row w-full items-stretch mt-2">
                      <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                        <div className="flex flex-row gap-4 items-end">
                          <div className="flex flex-col">
                            <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Projection end date</label>
                            <input type="date" className={`w-36 px-3 py-2 rounded border outline-none transition focus:ring-2 ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500' : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'}`} />
                          </div>
                          <div className="flex flex-col">
                            <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Or Age at projection date</label>
                            <input type="number" min="0" step="1" placeholder="Age" className={`w-24 px-3 py-2 rounded border outline-none transition focus:ring-2 ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500' : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'}`} />
                          </div>
                        </div>
                      </div>
                      <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                      <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                        <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>The Projection End Date is the clients selected retirement age. You should have a projection to this age. You can run the CYC to a different retirement age, but only if the provider has confirmed in writting that they cant produce projections to the selected retirement age</span>
                      </div>
                    </div>
                    {/* Q7: Implied annual charge */}
                    <div className="flex flex-row w-full items-stretch mt-2">
                      <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                        <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>This gives an implied annual charge of approximately:</label>
                        <div className={`w-full px-3 py-2 rounded border outline-none transition bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 flex items-center`} style={{ minHeight: 40 }}>
                          -
                        </div>
                      </div>
                      <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                      <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                        <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Where pension projections are available, they must be used and actuarial advice is that, regardless of the implied annual charge, the result of the Critical Yield Calculator should be accepted</span>
                      </div>
                    </div>
                  </div>
                )}
                {/* Plan Charge Basis Section */}
                {cycBasisRadio === 'Plan charges' && (
                  <div className="mt-2">
                    <div className={`text-lg font-semibold mb-4 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Plan Charge Basis</div>
                    {/* Q1: AMC row of 3 inputs */}
                    <div className="flex flex-row w-full items-stretch mt-2">
                      <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                        <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Enter the Annual Management Charges (AMC) for the next 1 months of the policy.</label>
                        <div className="flex flex-row gap-4 items-end w-full">
                          {/* Product/Wrapper annual charge (percent) */}
                          <div className="flex flex-col w-40">
                            <label className={`block mb-1 text-xs font-medium ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Product/Wrapper annual charge</label>
                            <div className="relative w-full">
                              <input
                                type="text"
                                inputMode="decimal"
                                pattern="^\\d*(\\.\\d{0,2})?$"
                                min="0"
                                step="any"
                                placeholder="%"
                                className={`w-full pr-7 pl-3 py-2 rounded border outline-none transition focus:ring-2 ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500' : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'}`}
                                style={{ fontVariantNumeric: 'tabular-nums' }}
                              />
                              <span className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-zinc-300' : 'text-zinc-500'}`}>%</span>
                            </div>
                          </div>
                          {/* From month */}
                          <div className="flex flex-col w-24">
                            <label className={`block mb-1 text-xs font-medium ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>From month</label>
                            <input type="number" min="1" step="1" placeholder="From" className={`w-full px-3 py-2 rounded border outline-none transition focus:ring-2 ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500' : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'}`} />
                          </div>
                          {/* To month */}
                          <div className="flex flex-col w-24">
                            <label className={`block mb-1 text-xs font-medium ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>To month</label>
                            <input type="number" min="1" step="1" placeholder="To" className={`w-full px-3 py-2 rounded border outline-none transition focus:ring-2 ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500' : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'}`} />
                          </div>
                        </div>
                        {/* Add another product/wrapper charge button */}
                        <button type="button" className={`mt-3 border rounded px-4 py-1.5 text-sm font-medium ${darkMode ? 'border-zinc-700 text-zinc-200 bg-transparent hover:bg-zinc-800' : 'border-zinc-300 text-zinc-700 bg-transparent hover:bg-zinc-100'} transition`}>
                          Add another product/wrapper charge
                        </button>
                      </div>
                      <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                      <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                        <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Where there is a fund rebate, please reduce the AMC accordingly. At least one Product/Wrapper annual change from month 1 to month 1 must be included</span>
                      </div>
                    </div>
                    {/* Q2: Do all funds have the same annual charge? */}
                    <div className="flex flex-row w-full items-stretch mt-2">
                      <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                        <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Do all funds have the same annual charge?</label>
                        <div className="flex gap-6 mt-1">
                          {['Yes', 'No', 'Not applicable'].map(opt => (
                            <label key={opt} className="inline-flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="plancharge-samecharge"
                                value={opt}
                                checked={sameAnnualChargeRadio === opt}
                                onChange={e => setSameAnnualChargeRadio(e.target.value)}
                                className="accent-blue-600 w-4 h-4 mr-2"
                              />
                              <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                      <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                        <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}></span>
                      </div>
                    </div>
                    {/* Special question: Is the fund value equal to the transfer value (only if No above) */}
                    {sameAnnualChargeRadio === 'No' && (
                      <>
                        <div className="flex flex-row w-full items-stretch mt-2">
                          <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                            <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Is the fund value equal to the transfer value?</label>
                            <div className="flex gap-6 mt-1">
                              {['Yes', 'No'].map(opt => (
                                <label key={opt} className="inline-flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name="fundvalue-equal-transfer"
                                    value={opt}
                                    checked={fundValueEqualsTransferValueRadio === opt}
                                    onChange={e => setFundValueEqualsTransferValueRadio(e.target.value)}
                                    className="accent-blue-600 w-4 h-4 mr-2"
                                  />
                                  <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                          <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                            <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}></span>
                          </div>
                        </div>
                        {/* Fund charge details special question */}
                        <div className="flex flex-row w-full mt-2">
                          {/* Left: Question, table, add button, validation */}
                          <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                            <label className={`block font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Fund charge details</label>
                            <div className="w-full max-w-full overflow-x-auto mt-2">
                              <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
                                {/* Table headers */}
                                <div className="flex flex-row w-full mb-1 min-w-[520px]">
                                  <div className={`flex-1 font-medium text-xs pl-2 pb-1 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Fund name</div>
                                  <div className={`w-40 font-medium text-xs pb-1 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Fund value (£)</div>
                                  <div className={`w-32 font-medium text-xs pb-1 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Charge</div>
                                  <div className="w-16 font-medium text-xs pb-1"></div>
                                </div>
                                {/* Fund rows */}
                                {fundChargeDetails.map((detail, idx) => (
                                  <div key={idx} className="flex flex-row w-full items-end mb-1 min-w-[520px]">
                                    {/* Fund name */}
                                    <div className="flex-1">
                                      <input
                                        type="text"
                                        value={detail.name}
                                        onChange={e => {
                                          const updated = [...fundChargeDetails];
                                          updated[idx] = { ...updated[idx], name: e.target.value };
                                          setFundChargeDetails(updated);
                                        }}
                                        className={`w-full px-3 py-2 rounded border outline-none transition focus:ring-2 ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500' : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'}`}
                                      />
                                    </div>
                                    {/* Fund value (currency) */}
                                    <div className="w-40 relative">
                                      <span className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-zinc-300' : 'text-zinc-500'}`}>£</span>
                                      <input
                                        type="text"
                                        inputMode="decimal"
                                        pattern="^\\d*(\\.\\d{0,2})?$"
                                        min="0"
                                        step="any"
                                        value={detail.value}
                                        onChange={e => {
                                          const val = e.target.value.replace(/[^\\d.]/g, '');
                                          const updated = [...fundChargeDetails];
                                          updated[idx] = { ...updated[idx], value: val };
                                          setFundChargeDetails(updated);
                                        }}
                                        className={`w-full pl-7 pr-3 py-2 rounded border outline-none transition focus:ring-2 ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500' : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'}`}
                                        style={{ fontVariantNumeric: 'tabular-nums' }}
                                      />
                                    </div>
                                    {/* Charge (percentage) */}
                                    <div className="w-32 relative">
                                      <input
                                        type="text"
                                        inputMode="decimal"
                                        pattern="^\\d*(\\.\\d{0,2})?$"
                                        min="0"
                                        step="any"
                                        value={detail.charge}
                                        onChange={e => {
                                          const val = e.target.value.replace(/[^\\d.]/g, '');
                                          const updated = [...fundChargeDetails];
                                          updated[idx] = { ...updated[idx], charge: val };
                                          setFundChargeDetails(updated);
                                        }}
                                        className={`w-full pr-7 pl-3 py-2 rounded border outline-none transition focus:ring-2 ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500' : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'}`}
                                        style={{ fontVariantNumeric: 'tabular-nums' }}
                                      />
                                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-zinc-300' : 'text-zinc-500'}`}>%</span>
                                    </div>
                                    {/* Delete link */}
                                    <div className="w-16 flex items-center justify-center">
                                      <button
                                        type="button"
                                        className={`text-sm underline ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:opacity-80`}
                                        onClick={() => {
                                          const updated = fundChargeDetails.filter((_, i) => i !== idx);
                                          setFundChargeDetails(updated);
                                        }}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {/* Add another fund and average charge row */}
                              <div className="flex flex-row items-center mt-2 min-w-[520px]">
                                <button
                                  type="button"
                                  className={`border rounded px-4 py-1.5 text-sm font-medium ${darkMode ? 'border-zinc-700 text-zinc-200 bg-transparent hover:bg-zinc-800' : 'border-zinc-300 text-zinc-700 bg-transparent hover:bg-zinc-100'} transition`}
                                  onClick={() => setFundChargeDetails([...fundChargeDetails, { name: '', value: '', charge: '' }])}
                                >
                                  Add another fund
                                </button>
                                <div className="flex-1" />
                                <div className={`text-sm ml-4 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Average charge rate 0.00%</div>
                              </div>
                            </div>
                          </div>
                          {/* Divider */}
                          <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                          {/* Right: Guidance (empty for now) */}
                          <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                            <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}></span>
                          </div>
                        </div>
                      </>
                    )}
                    {/* Fund annual charge question (only if Yes) */}
                    {sameAnnualChargeRadio === 'Yes' && (
                      <div className="flex flex-row w-full items-stretch mt-2">
                        <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                          <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Fund annual charge</label>
                          <div className="relative w-40">
                            <input
                              type="text"
                              inputMode="decimal"
                              pattern="^\\d*(\\.\\d{0,2})?$"
                              min="0"
                              step="any"
                              placeholder="%"
                              value={fundAnnualCharge}
                              onChange={e => {
                                // Only allow numbers and decimal point
                                const val = e.target.value.replace(/[^\\d.]/g, '');
                                setFundAnnualCharge(val);
                              }}
                              className={`w-full pr-7 pl-3 py-2 rounded border outline-none transition focus:ring-2 ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500' : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'}`}
                              style={{ fontVariantNumeric: 'tabular-nums' }}
                            />
                            <span className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-zinc-300' : 'text-zinc-500'}`}>%</span>
                          </div>
                        </div>
                        <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                        <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                          <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}></span>
                        </div>
                      </div>
                    )}
                    {/* Q3: Do all plans have fixed charge/policy fee? (always shown at end of Plan Charge Basis section) */}
                    <div className="flex flex-row w-full items-stretch mt-2">
                      <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                        <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Do all plans have fixed charge/policy fee?</label>
                        <div className="flex gap-6 mt-1">
                          {['Yes', 'No'].map(opt => (
                            <label key={opt} className="inline-flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="plancharge-fixedfee"
                                value={opt}
                                checked={fixedChargeRadio === opt}
                                onChange={e => setFixedChargeRadio(e.target.value)}
                                className="accent-blue-600 w-4 h-4 mr-2"
                              />
                              <span className={darkMode ? 'text-zinc-200' : 'text-zinc-700'}>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                      <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                        <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}></span>
                      </div>
                    </div>
                    {/* Special questions for fixed charge/policy fee Yes */}
                    {fixedChargeRadio === 'Yes' && (
                      <>
                        {/* Amount of Charge/Policy fee */}
                        <div className="flex flex-row w-full items-stretch mt-2">
                          <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                            <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Amount of Charge/Policy fee</label>
                            <div className="relative w-40">
                              <span className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-zinc-300' : 'text-zinc-500'}`}>£</span>
                              <input
                                type="text"
                                inputMode="decimal"
                                pattern="^\\d*(\\.\\d{0,2})?$"
                                min="0"
                                step="any"
                                placeholder="Amount"
                                value={fixedChargeAmount}
                                onChange={e => {
                                  const val = e.target.value.replace(/[^\\d.]/g, '');
                                  setFixedChargeAmount(val);
                                }}
                                className={`w-full pl-7 pr-3 py-2 rounded border outline-none transition focus:ring-2 ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500' : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'}`}
                                style={{ fontVariantNumeric: 'tabular-nums' }}
                              />
                            </div>
                          </div>
                          <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                          <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                            <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Please input any non fund related charges (i.e policy fee)</span>
                          </div>
                        </div>
                        {/* Frequency dropdown with custom icon */}
                        <div className="flex flex-row w-full items-stretch mt-2">
                          <div className="flex-1 pr-8 py-2 flex flex-col justify-center">
                            <label className={`block mb-1 font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>Frequency</label>
                            <div className="relative w-40">
                              <select
                                value={fixedChargeFrequency}
                                onChange={e => setFixedChargeFrequency(e.target.value)}
                                className={`w-full px-3 py-2 rounded border outline-none transition focus:ring-2 appearance-none pr-10 ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500' : 'bg-white border-zinc-300 text-zinc-900 focus:ring-zinc-300'}`}
                              >
                                {['', 'Monthly', 'Quarterly', 'Half Yearly', 'Yearly'].map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                                <ChevronDown size={18} />
                              </span>
                            </div>
                          </div>
                          <div className="self-stretch mx-2" style={{ width: '2px', background: darkMode ? '#3f3f46' : '#e4e4e7' }} />
                          <div className="flex-1 pl-8 py-2 flex items-center min-h-[40px]">
                            <span className={`text-base text-left w-full transition-colors duration-200 ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}></span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
    </>
  );
}