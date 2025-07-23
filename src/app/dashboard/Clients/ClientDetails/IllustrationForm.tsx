import React, { useState } from "react";
import { ChevronDown, Calendar, AlertCircle, HelpCircle, Plus, X, Search } from "lucide-react";

export default function IllustrationForm({ onBack, darkMode }: { onBack: () => void; darkMode: boolean }) {
  // Form state
  const [formData, setFormData] = useState({
    title: "Mrs",
    forename: "Annelise",
    surname: "Cruickshank",
    dateOfBirth: "1955-04-30",
    gender: "Female",
    earnings: "30000",
    lookUpTaxResidency: "Yes",
    nationalInsuranceNumber: "WB966536C",
    taxResidency: "Rest of UK",
    taxRate: "20"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInvestmentChange = (field: string, value: string) => {
    setInvestmentData(prev => ({ ...prev, [field]: value }));
  };

  const handleTransferChange = (field: string, value: string) => {
    setTransferData(prev => ({ ...prev, [field]: value }));
  };

  const [activeTab, setActiveTab] = useState(0);
  const [investmentData, setInvestmentData] = useState({
    additionalInvestment: "",
    annualAllowanceType: "Standard",
    commencementDate: "2025-07-17"
  });
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [transferData, setTransferData] = useState({
    type: "",
    transferFrom: "Other provider",
    providerName: "",
    transferAmount: "",
    concessionNumber: "",
    adviceFees: "No"
  });
  
  const progressTabs = [
    "Account owner",
    "Investment", 
    "Benefits",
    "Uncrystallised fund selection",
    "Illustration Summary"
  ];

  return (
    <div
      className="w-full h-full flex flex-col border rounded-lg max-w-full"
      style={{
        background: darkMode ? '#18181b' : '#fff',
        boxSizing: 'border-box',
        borderColor: darkMode ? '#3f3f46' : '#e4e4e7'
      }}
    >
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>
        <div className="flex items-center justify-between">
          <h1 
            className="text-2xl font-bold"
            style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
          >
            {progressTabs[activeTab]}
          </h1>
          <button
            onClick={onBack}
            className="px-2.5 py-1.5 rounded border border-blue-600 bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition"
            style={{ minWidth: 0, lineHeight: 1.2 }}
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Progress Tabs */}
      <div className="px-6 py-4 border-b" style={{ borderColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>
        <div className="flex items-center">
          {progressTabs.map((tab, index) => (
            <React.Fragment key={tab}>
              <div className="flex items-center">
                <div
                  className={`px-4 py-2 rounded-l-lg border-l border-t border-b text-sm font-medium transition-colors cursor-pointer hover:opacity-80 ${
                    index === activeTab 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-gray-100 text-gray-600 border-gray-300'
                  }`}
                  style={{
                    background: index === activeTab 
                      ? '#2563eb' 
                      : darkMode ? '#2a2a2a' : '#f4f4f5',
                    color: index === activeTab 
                      ? '#ffffff' 
                      : darkMode ? '#a1a1aa' : '#6b7280',
                    borderColor: index === activeTab 
                      ? '#2563eb' 
                      : darkMode ? '#3f3f46' : '#d1d5db'
                  }}
                  onClick={() => setActiveTab(index)}
                >
                  {tab}
                </div>
                {index < progressTabs.length - 1 && (
                  <div
                    className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent"
                    style={{
                      borderLeftColor: index === activeTab 
                        ? '#2563eb' 
                        : darkMode ? '#2a2a2a' : '#f4f4f5'
                    }}
                  />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div 
          className="w-full h-full rounded-lg p-6"
          style={{
            background: darkMode ? '#2a2a2a' : '#fafaf9',
            border: `1px solid ${darkMode ? '#3f3f46' : '#e4e4e7'}`
          }}
        >
          {activeTab === 0 && (
            <div className="flex gap-8">
              {/* Account Owner Section */}
              <div className="flex-1 space-y-4">
                <h2 
                  className="text-lg font-semibold mb-4"
                  style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                >
                  Account owner
                </h2>
                
                {/* Title */}
                <div className="flex items-center">
                  <label 
                    className="w-48 text-sm font-medium"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Title:
                  </label>
                  <div className="flex-1 relative">
                    <select
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 rounded border appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{
                        background: darkMode ? '#1e1e1e' : '#ffffff',
                        borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                        color: darkMode ? '#f1f5f9' : '#18181b'
                      }}
                    >
                      <option value="Mrs">Mrs</option>
                      <option value="Mr">Mr</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>
                    </select>
                    <ChevronDown 
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      size={16}
                      style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                    />
                  </div>
                </div>

                {/* Forename */}
                <div className="flex items-center">
                  <label 
                    className="w-48 text-sm font-medium"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Forename(s):
                  </label>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.forename}
                      onChange={(e) => handleInputChange('forename', e.target.value)}
                      className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{
                        background: darkMode ? '#1e1e1e' : '#ffffff',
                        borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                        color: darkMode ? '#f1f5f9' : '#18181b'
                      }}
                    />
                  </div>
                </div>

                {/* Surname */}
                <div className="flex items-center">
                  <label 
                    className="w-48 text-sm font-medium"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Surname:
                  </label>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.surname}
                      onChange={(e) => handleInputChange('surname', e.target.value)}
                      className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{
                        background: darkMode ? '#1e1e1e' : '#ffffff',
                        borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                        color: darkMode ? '#f1f5f9' : '#18181b'
                      }}
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="flex items-center">
                  <label 
                    className="w-48 text-sm font-medium"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Date of birth:
                  </label>
                  <div className="flex-1 relative">
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      style={{
                        background: darkMode ? '#1e1e1e' : '#ffffff',
                        borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                        color: darkMode ? '#f1f5f9' : '#18181b'
                      }}
                    />
                    <Calendar 
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      size={16}
                      style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="flex items-center">
                  <label 
                    className="w-48 text-sm font-medium"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Gender:
                  </label>
                  <div className="flex-1 flex gap-6">
                    {['Male', 'Female'].map((gender) => (
                      <label key={gender} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="w-4 h-4 mr-2 accent-blue-600"
                        />
                        <span style={{ color: darkMode ? '#e4e4e7' : '#374151' }}>
                          {gender}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Earnings */}
                <div className="flex items-center">
                  <label 
                    className="w-48 text-sm font-medium"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Earnings (before tax, per annum):
                  </label>
                  <div className="flex-1 relative">
                    <span 
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                    >
                      £
                    </span>
                    <input
                      type="text"
                      value={formData.earnings}
                      onChange={(e) => handleInputChange('earnings', e.target.value)}
                      className="w-full px-3 py-2 pl-8 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{
                        background: darkMode ? '#1e1e1e' : '#ffffff',
                        borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                        color: darkMode ? '#f1f5f9' : '#18181b'
                      }}
                    />
                  </div>
                </div>

                {/* Look up tax residency */}
                <div className="flex items-center">
                  <label 
                    className="w-48 text-sm font-medium"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Look up tax residency?:
                  </label>
                  <div className="flex-1 flex gap-6">
                    {['Yes', 'No'].map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="lookUpTaxResidency"
                          value={option}
                          checked={formData.lookUpTaxResidency === option}
                          onChange={(e) => handleInputChange('lookUpTaxResidency', e.target.value)}
                          className="w-4 h-4 mr-2 accent-blue-600"
                        />
                        <span style={{ color: darkMode ? '#e4e4e7' : '#374151' }}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* National Insurance Number */}
                <div className="flex items-center">
                  <label 
                    className="w-48 text-sm font-medium"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    National insurance number:
                  </label>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={formData.nationalInsuranceNumber}
                      onChange={(e) => handleInputChange('nationalInsuranceNumber', e.target.value)}
                      className="flex-1 px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{
                        background: darkMode ? '#1e1e1e' : '#ffffff',
                        borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                        color: darkMode ? '#f1f5f9' : '#18181b'
                      }}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
                    >
                      Check residency
                    </button>
                  </div>
                </div>

                {/* Help text */}
                <div className="ml-48">
                  <p 
                    className="text-xs leading-relaxed"
                    style={{ color: darkMode ? '#a1a1aa' : '#6b7280' }}
                  >
                    A valid National Insurance number is required if you wish to check the residency as part of the illustration. If this is not checked in the illustration it will be checked as part of the EBS data submission, unless the client is under 16 years of age when the residency check is not required.
                  </p>
                </div>

                {/* Tax Residency */}
                <div className="flex items-center">
                  <label 
                    className="w-48 text-sm font-medium"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Tax residency:
                  </label>
                  <div className="flex-1 relative">
                    <select
                      value={formData.taxResidency}
                      onChange={(e) => handleInputChange('taxResidency', e.target.value)}
                      className="w-full px-3 py-2 rounded border appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{
                        background: darkMode ? '#1e1e1e' : '#ffffff',
                        borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                        color: darkMode ? '#f1f5f9' : '#18181b'
                      }}
                    >
                      <option value="Rest of UK">Rest of UK</option>
                      <option value="Scotland">Scotland</option>
                      <option value="Wales">Wales</option>
                      <option value="Northern Ireland">Northern Ireland</option>
                    </select>
                    <ChevronDown 
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      size={16}
                      style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                    />
                  </div>
                </div>

                {/* Confirmation message */}
                <div className="ml-48">
                  <p 
                    className="text-xs"
                    style={{ color: darkMode ? '#10b981' : '#059669' }}
                  >
                    Client found by HMRC and residency has been set accordingly.
                  </p>
                </div>

                {/* Tax Rate */}
                <div className="flex items-center">
                  <label 
                    className="w-48 text-sm font-medium"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Tax rate:
                  </label>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={formData.taxRate}
                      onChange={(e) => handleInputChange('taxRate', e.target.value)}
                      className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                      style={{
                        background: darkMode ? '#1e1e1e' : '#ffffff',
                        borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                        color: darkMode ? '#f1f5f9' : '#18181b'
                      }}
                    />
                    <span 
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                    >
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Spouse/Dependant Section */}
              <div className="w-px bg-gray-300 mx-4" style={{ background: darkMode ? '#3f3f46' : '#d1d5db' }} />
              
              <div className="flex-1 space-y-4">
                <h2 
                  className="text-lg font-semibold mb-4"
                  style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                >
                  Spouse / dependant (for example annuity)
                </h2>
                
                {/* Date of Birth */}
                <div className="flex items-center">
                  <label 
                    className="w-48 text-sm font-medium"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Date of birth:
                  </label>
                  <div className="flex-1 relative">
                    <input
                      type="date"
                      className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      style={{
                        background: darkMode ? '#1e1e1e' : '#ffffff',
                        borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                        color: darkMode ? '#f1f5f9' : '#18181b'
                      }}
                    />
                    <Calendar 
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      size={16}
                      style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="flex items-center">
                  <label 
                    className="w-48 text-sm font-medium"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Gender:
                  </label>
                  <div className="flex-1 flex gap-6">
                    {['Male', 'Female'].map((gender) => (
                      <label key={gender} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="spouseGender"
                          value={gender}
                          className="w-4 h-4 mr-2 accent-blue-600"
                        />
                        <span style={{ color: darkMode ? '#e4e4e7' : '#374151' }}>
                          {gender}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-6">
              {/* Warning Banner */}
              <div 
                className="flex items-start gap-3 p-4 rounded-lg border-l-4"
                style={{
                  background: darkMode ? '#fef2f2' : '#fef2f2',
                  borderLeftColor: '#dc2626',
                  borderColor: darkMode ? '#dc2626' : '#dc2626'
                }}
              >
                <AlertCircle 
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                  style={{ color: '#dc2626' }}
                />
                <div>
                  <p 
                    className="font-medium"
                    style={{ color: '#dc2626' }}
                  >
                    Please complete the following information
                  </p>
                  <p 
                    className="text-sm mt-1"
                    style={{ color: '#dc2626' }}
                  >
                    Is this an additional investment to an existing Retirement Account?
                  </p>
                </div>
              </div>

              {/* Account Details Section */}
              <div 
                className="p-4 rounded-lg border"
                style={{
                  background: darkMode ? '#2a2a2a' : '#f9fafb',
                  borderColor: darkMode ? '#3f3f46' : '#e5e7eb'
                }}
              >
                <h3 
                  className="text-base font-semibold mb-4"
                  style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                >
                  Account details
                </h3>
                <div className="flex items-center gap-3">
                  <AlertCircle 
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: '#dc2626' }}
                  />
                  <label 
                    className="text-sm font-medium flex-1"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Is this an additional investment to an existing Retirement Account?
                  </label>
                  <div className="flex gap-6">
                    {['Yes', 'No'].map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="additionalInvestment"
                          value={option}
                          checked={investmentData.additionalInvestment === option}
                          onChange={(e) => handleInvestmentChange('additionalInvestment', e.target.value)}
                          className="w-4 h-4 mr-2 accent-blue-600"
                        />
                        <span style={{ color: darkMode ? '#e4e4e7' : '#374151' }}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Annual Allowance Section */}
              <div 
                className="p-4 rounded-lg border"
                style={{
                  background: darkMode ? '#2a2a2a' : '#f9fafb',
                  borderColor: darkMode ? '#3f3f46' : '#e5e7eb'
                }}
              >
                <h3 
                  className="text-base font-semibold mb-4"
                  style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                >
                  Annual allowance
                </h3>
                <div className="flex items-center gap-3">
                  <label 
                    className="text-sm font-medium"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Annual allowance type:
                  </label>
                  <HelpCircle 
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: '#3b82f6' }}
                  />
                  <div className="flex-1 relative max-w-xs">
                    <select
                      value={investmentData.annualAllowanceType}
                      onChange={(e) => handleInvestmentChange('annualAllowanceType', e.target.value)}
                      className="w-full px-3 py-2 rounded border appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{
                        background: darkMode ? '#1e1e1e' : '#ffffff',
                        borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                        color: darkMode ? '#f1f5f9' : '#18181b'
                      }}
                    >
                      <option value="Standard">Standard</option>
                      <option value="Tapered">Tapered</option>
                      <option value="Money Purchase">Money Purchase</option>
                    </select>
                    <ChevronDown 
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      size={16}
                      style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                    />
                  </div>
                  <span 
                    className="text-xs"
                    style={{ color: darkMode ? '#a1a1aa' : '#6b7280' }}
                  >
                    Where a client is subject to the Tapered Annual Allowance, or it may apply, please select &apos;Standard&apos;.
                  </span>
                </div>
              </div>

              {/* Illustration Basis Section */}
              <div 
                className="p-4 rounded-lg border"
                style={{
                  background: darkMode ? '#2a2a2a' : '#f9fafb',
                  borderColor: darkMode ? '#3f3f46' : '#e5e7eb'
                }}
              >
                <h3 
                  className="text-base font-semibold mb-4"
                  style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                >
                  Illustration basis
                </h3>
                <div className="flex items-center gap-3">
                  <label 
                    className="text-sm font-medium"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Commencement date:
                  </label>
                  <div className="flex-1 relative max-w-xs">
                    <input
                      type="date"
                      value={investmentData.commencementDate}
                      onChange={(e) => handleInvestmentChange('commencementDate', e.target.value)}
                      className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      style={{
                        background: darkMode ? '#1e1e1e' : '#ffffff',
                        borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                        color: darkMode ? '#f1f5f9' : '#18181b'
                      }}
                    />
                    <Calendar 
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      size={16}
                      style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                    />
                  </div>
                </div>
              </div>

              {/* Single Contributions Section */}
              <div 
                className="p-4 rounded-lg border"
                style={{
                  background: darkMode ? '#2a2a2a' : '#f9fafb',
                  borderColor: darkMode ? '#3f3f46' : '#e5e7eb'
                }}
              >
                <h3 
                  className="text-base font-semibold mb-4"
                  style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                >
                  Single contributions
                </h3>
                <button
                  type="button"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                  style={{ color: darkMode ? '#60a5fa' : '#2563eb' }}
                >
                  <Plus className="w-4 h-4 font-bold" />
                  <span className="font-medium">Add single contributions</span>
                </button>
              </div>

              {/* Regular Contributions Section */}
              <div 
                className="p-4 rounded-lg border"
                style={{
                  background: darkMode ? '#2a2a2a' : '#f9fafb',
                  borderColor: darkMode ? '#3f3f46' : '#e5e7eb'
                }}
              >
                <h3 
                  className="text-base font-semibold mb-4"
                  style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                >
                  Regular contributions
                </h3>
                <button
                  type="button"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                  style={{ color: darkMode ? '#60a5fa' : '#2563eb' }}
                >
                  <Plus className="w-4 h-4 font-bold" />
                  <span className="font-medium">Add regular contributions</span>
                </button>
              </div>

              {/* Transfers Section */}
              <div 
                className="p-4 rounded-lg border"
                style={{
                  background: darkMode ? '#2a2a2a' : '#f9fafb',
                  borderColor: darkMode ? '#3f3f46' : '#e5e7eb'
                }}
              >
                <h3 
                  className="text-base font-semibold mb-2"
                  style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                >
                  Transfers
                </h3>
                <p 
                  className="text-sm mb-4"
                  style={{ color: darkMode ? '#a1a1aa' : '#6b7280' }}
                >
                  All transfers, including those going into immediate drawdown, need to be listed here.
                </p>

                {showTransferForm && (
                  <div className="space-y-6 mb-6">
                    {/* First transfer entry */}
                    <div className="border rounded-lg p-4" style={{ borderColor: darkMode ? '#3f3f46' : '#e5e7eb' }}>
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium" style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}>
                          First transfer
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowTransferForm(false)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors text-sm"
                          style={{ color: darkMode ? '#60a5fa' : '#2563eb' }}
                        >
                          <X className="w-3 h-3" />
                          <span>Remove transfer</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-6">
                        {/* Type */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" style={{ color: '#dc2626' }} />
                            <label className="text-sm font-medium" style={{ color: darkMode ? '#e4e4e7' : '#374151' }}>
                              Type
                            </label>
                          </div>
                          <div className="space-y-2">
                            {['Uncrystallised', 'Crystallised'].map((type) => (
                              <label key={type} className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name="transferType"
                                  value={type}
                                  checked={transferData.type === type}
                                  onChange={(e) => handleTransferChange('type', e.target.value)}
                                  className="w-4 h-4 mr-2 accent-blue-600"
                                />
                                <span className="text-sm" style={{ color: darkMode ? '#e4e4e7' : '#374151' }}>
                                  {type}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Transfer from */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" style={{ color: '#dc2626' }} />
                            <label className="text-sm font-medium" style={{ color: darkMode ? '#e4e4e7' : '#374151' }}>
                              Transfer from
                            </label>
                          </div>
                          <div className="space-y-2">
                            {['St. James&apos;s Place', 'Other provider'].map((provider) => (
                              <label key={provider} className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name="transferFrom"
                                  value={provider}
                                  checked={transferData.transferFrom === provider}
                                  onChange={(e) => handleTransferChange('transferFrom', e.target.value)}
                                  className="w-4 h-4 mr-2 accent-blue-600"
                                />
                                <span className="text-sm" style={{ color: darkMode ? '#e4e4e7' : '#374151' }}>
                                  {provider}
                                </span>
                              </label>
                            ))}
                            {transferData.transferFrom === 'Other provider' && (
                              <input
                                type="text"
                                placeholder="Provider name"
                                value={transferData.providerName}
                                onChange={(e) => handleTransferChange('providerName', e.target.value)}
                                className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                style={{
                                  background: darkMode ? '#1e1e1e' : '#ffffff',
                                  borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                                  color: darkMode ? '#f1f5f9' : '#18181b'
                                }}
                              />
                            )}
                          </div>
                        </div>

                        {/* Transfer amount */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" style={{ color: '#dc2626' }} />
                            <label className="text-sm font-medium" style={{ color: darkMode ? '#e4e4e7' : '#374151' }}>
                              Transfer amount
                            </label>
                          </div>
                          <div className="space-y-2">
                            <div className="relative">
                              <span 
                                className="absolute left-3 top-1/2 -translate-y-1/2"
                                style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                              >
                                £
                              </span>
                              <input
                                type="text"
                                placeholder="0.00"
                                value={transferData.transferAmount}
                                onChange={(e) => handleTransferChange('transferAmount', e.target.value)}
                                className="w-full px-3 py-2 pl-8 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                style={{
                                  background: darkMode ? '#1e1e1e' : '#ffffff',
                                  borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                                  color: darkMode ? '#f1f5f9' : '#18181b'
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors text-sm"
                                style={{ color: darkMode ? '#60a5fa' : '#2563eb' }}
                              >
                                <Search className="w-3 h-3" />
                                <span>Find Provider</span>
                              </button>
                              <div className="flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" style={{ color: '#dc2626' }} />
                                <span className="text-xs" style={{ color: '#dc2626' }}>
                                  Please use Find Provider to search for other providers
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional fields */}
                    <div className="space-y-4">
                      <p 
                        className="text-sm"
                        style={{ color: darkMode ? '#a1a1aa' : '#6b7280' }}
                      >
                        Where a ceding provider is expected to make multiple transfer payments, please ensure the corresponding number of transfers are entered. This will allow the transfers to be processed promptly.
                      </p>

                      <div className="flex items-center gap-3">
                        <label 
                          className="text-sm font-medium"
                          style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                        >
                          Concession number:
                        </label>
                        <div className="flex-1 max-w-xs">
                          <input
                            type="text"
                            placeholder=""
                            value={transferData.concessionNumber}
                            onChange={(e) => handleTransferChange('concessionNumber', e.target.value)}
                            className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            style={{
                              background: darkMode ? '#1e1e1e' : '#ffffff',
                              borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                              color: darkMode ? '#f1f5f9' : '#18181b'
                            }}
                          />
                        </div>
                      </div>

                      <p 
                        className="text-xs"
                        style={{ color: darkMode ? '#a1a1aa' : '#6b7280' }}
                      >
                        If you have been granted a concession starting with S or E, please enter the number here, otherwise leave blank.
                      </p>

                      <div className="flex items-center gap-3">
                        <label 
                          className="text-sm font-medium"
                          style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                        >
                          Are any of the Advice Fees being given up (i.e. IAF, Credit or OAF)?
                        </label>
                        <div className="flex gap-6">
                          {['Yes', 'No'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="adviceFees"
                                value={option}
                                checked={transferData.adviceFees === option}
                                onChange={(e) => handleTransferChange('adviceFees', e.target.value)}
                                className="w-4 h-4 mr-2 accent-blue-600"
                              />
                              <span className="text-sm" style={{ color: darkMode ? '#e4e4e7' : '#374151' }}>
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowTransferForm(true)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors underline"
                  style={{ color: darkMode ? '#60a5fa' : '#2563eb' }}
                >
                  <Plus className="w-4 h-4 font-bold" />
                  <span className="font-medium">Add transfer</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-6">
              {/* Warning Banner */}
              <div 
                className="flex items-start gap-3 p-4 rounded-lg border-l-4"
                style={{
                  background: darkMode ? '#fef2f2' : '#fef2f2',
                  borderLeftColor: '#dc2626',
                  borderColor: darkMode ? '#dc2626' : '#dc2626'
                }}
              >
                <AlertCircle 
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                  style={{ color: '#dc2626' }}
                />
                <div>
                  <p 
                    className="font-medium"
                    style={{ color: '#dc2626' }}
                  >
                    Please complete the following information
                  </p>
                  <ul className="text-sm mt-1 space-y-1">
                    <li style={{ color: '#dc2626' }}>• Is an uncrystallised funds pension lump sum required?</li>
                    <li style={{ color: '#dc2626' }}>• Anticipated retirement age</li>
                  </ul>
                </div>
              </div>

              {/* Uncrystallised funds pension lump sum Section */}
              <div 
                className="p-4 rounded-lg border"
                style={{
                  background: darkMode ? '#2a2a2a' : '#f9fafb',
                  borderColor: darkMode ? '#3f3f46' : '#e5e7eb'
                }}
              >
                <h3 
                  className="text-base font-semibold mb-4"
                  style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                >
                  Uncrystallised funds pension lump sum
                </h3>
                <div className="flex items-center gap-3">
                  <AlertCircle 
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: '#dc2626' }}
                  />
                  <label 
                    className="text-sm font-medium flex-1"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Is an uncrystallised funds pension lump sum required?
                  </label>
                  <div className="flex gap-6">
                    {['Yes', 'No'].map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="uncrystallisedFundsLumpSum"
                          value={option}
                          className="w-4 h-4 mr-2 accent-blue-600"
                        />
                        <span className="text-sm" style={{ color: darkMode ? '#e4e4e7' : '#374151' }}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                  <HelpCircle 
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: '#3b82f6' }}
                  />
                </div>
              </div>

              {/* Drawdown Section */}
              <div 
                className="p-4 rounded-lg border"
                style={{
                  background: darkMode ? '#2a2a2a' : '#f9fafb',
                  borderColor: darkMode ? '#3f3f46' : '#e5e7eb'
                }}
              >
                <h3 
                  className="text-base font-semibold mb-4"
                  style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                >
                  Drawdown
                </h3>
                <div className="flex items-center gap-3">
                  <label 
                    className="text-sm font-medium flex-1"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Do you wish to crystallise any funds for drawdown?
                  </label>
                  <div className="flex gap-6">
                    {['Yes', 'No'].map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="crystalliseForDrawdown"
                          value={option}
                          className="w-4 h-4 mr-2 accent-blue-600"
                        />
                        <span className="text-sm" style={{ color: darkMode ? '#e4e4e7' : '#374151' }}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Anticipated retirement age Section */}
              <div 
                className="p-4 rounded-lg border"
                style={{
                  background: darkMode ? '#2a2a2a' : '#f9fafb',
                  borderColor: darkMode ? '#3f3f46' : '#e5e7eb'
                }}
              >
                <h3 
                  className="text-base font-semibold mb-4"
                  style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                >
                  Anticipated retirement age
                </h3>
                <div className="flex items-center gap-3">
                  <AlertCircle 
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: '#dc2626' }}
                  />
                  <label 
                    className="text-sm font-medium"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Anticipated retirement age:
                  </label>
                  <div className="flex-1 max-w-xs">
                    <input
                      type="text"
                      placeholder=""
                      className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{
                        background: darkMode ? '#1e1e1e' : '#ffffff',
                        borderColor: '#dc2626',
                        color: darkMode ? '#f1f5f9' : '#18181b'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Example annuity details Section */}
              <div 
                className="p-4 rounded-lg border"
                style={{
                  background: darkMode ? '#2a2a2a' : '#f9fafb',
                  borderColor: darkMode ? '#3f3f46' : '#e5e7eb'
                }}
              >
                <h3 
                  className="text-base font-semibold mb-4"
                  style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                >
                  Example annuity details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <label 
                      className="text-sm font-medium w-48"
                      style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                    >
                      Pension escalation rate:
                    </label>
                    <div className="flex-1 relative max-w-xs">
                      <select
                        className="w-full px-3 py-2 rounded border appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                          background: darkMode ? '#1e1e1e' : '#ffffff',
                          borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                          color: darkMode ? '#f1f5f9' : '#18181b'
                        }}
                      >
                        <option value="Level">Level</option>
                        <option value="RPI">RPI</option>
                        <option value="CPI">CPI</option>
                        <option value="Fixed">Fixed</option>
                      </select>
                      <ChevronDown 
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        size={16}
                        style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label 
                      className="text-sm font-medium w-48"
                      style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                    >
                      Guarantee period:
                    </label>
                    <div className="flex-1 relative max-w-xs">
                      <select
                        className="w-full px-3 py-2 rounded border appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                          background: darkMode ? '#1e1e1e' : '#ffffff',
                          borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                          color: darkMode ? '#f1f5f9' : '#18181b'
                        }}
                      >
                        <option value="5 years">5 years</option>
                        <option value="10 years">10 years</option>
                        <option value="15 years">15 years</option>
                        <option value="No guarantee">No guarantee</option>
                      </select>
                      <ChevronDown 
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        size={16}
                        style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label 
                      className="text-sm font-medium w-48"
                      style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                    >
                      Dependant&apos;s pension:
                    </label>
                    <div className="flex-1 relative max-w-xs">
                      <select
                        className="w-full px-3 py-2 rounded border appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                          background: darkMode ? '#1e1e1e' : '#ffffff',
                          borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                          color: darkMode ? '#f1f5f9' : '#18181b'
                        }}
                      >
                        <option value="Single with no dependants">Single with no dependants</option>
                        <option value="Single life with dependant&apos;s pension">Single life with dependant&apos;s pension</option>
                        <option value="Joint life">Joint life</option>
                      </select>
                      <ChevronDown 
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        size={16}
                        style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-6">
              {/* AFT Fund Selection Section */}
              <div 
                className="p-4 rounded-lg border"
                style={{
                  background: darkMode ? '#2a2a2a' : '#f9fafb',
                  borderColor: darkMode ? '#3f3f46' : '#e5e7eb'
                }}
              >
                <h3 
                  className="text-base font-semibold mb-4"
                  style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                >
                  AFT fund selection
                </h3>
                <div className="flex items-center gap-3">
                  <label 
                    className="text-sm font-medium flex-1"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Do you want to use the Automatic Fund Transfer (AFT) facility for this Investment?
                  </label>
                  <div className="flex gap-6">
                    {['Yes', 'No'].map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="aftFacility"
                          value={option}
                          defaultChecked={option === 'No'}
                          className="w-4 h-4 mr-2 accent-blue-600"
                        />
                        <span className="text-sm" style={{ color: darkMode ? '#e4e4e7' : '#374151' }}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fund Selection Section */}
              <div 
                className="p-4 rounded-lg border"
                style={{
                  background: darkMode ? '#2a2a2a' : '#f9fafb',
                  borderColor: darkMode ? '#3f3f46' : '#e5e7eb'
                }}
              >
                <h3 
                  className="text-base font-semibold mb-4"
                  style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                >
                  Fund selection
                </h3>
                
                {/* Transfers Header */}
                <div className="mb-4">
                  <h4 
                    className="text-sm font-medium mb-3"
                    style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                  >
                    Transfers
                  </h4>
                  
                  {/* Table Header */}
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div></div>
                    <div 
                      className="text-sm font-medium text-center"
                      style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                    >
                      Distribution
                    </div>
                    <div 
                      className="text-sm font-medium text-center"
                      style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                    >
                      Non-distribution
                    </div>
                  </div>

                  {/* Portfolio List */}
                  <div className="space-y-3">
                    {[
                      'Adventurous Portfolio',
                      'Balanced Portfolio', 
                      'Conservative Portfolio',
                      'Managed Funds Portfolio',
                      'Strategic Growth Portfolio'
                    ].map((portfolio) => (
                      <div key={portfolio} className="grid grid-cols-3 gap-4 items-center">
                        <div 
                          className="text-sm"
                          style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                        >
                          {portfolio}
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder=""
                            className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 text-center"
                            style={{
                              background: darkMode ? '#1e1e1e' : '#ffffff',
                              borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                              color: darkMode ? '#f1f5f9' : '#18181b'
                            }}
                          />
                          <span 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                            style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                          >
                            %
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder=""
                            className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 text-center"
                            style={{
                              background: darkMode ? '#1e1e1e' : '#ffffff',
                              borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                              color: darkMode ? '#f1f5f9' : '#18181b'
                            }}
                          />
                          <span 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                            style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                          >
                            %
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Hide individual funds link */}
                  <div className="mt-4">
                    <button
                      type="button"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors text-sm"
                      style={{ color: darkMode ? '#60a5fa' : '#2563eb' }}
                    >
                      <span>Hide individual funds</span>
                      <ChevronDown className="w-3 h-3 rotate-180" />
                    </button>
                  </div>

                  {/* Polaris and InRetirement Range */}
                  <div className="mt-6">
                    <h4 
                      className="text-sm font-medium mb-3"
                      style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                    >
                      Polaris and InRetirement Range
                    </h4>
                    
                    <div className="space-y-3">
                      {['Polaris 1', 'Polaris 2', 'Polaris 3', 'Polaris 4'].map((fund) => (
                        <div key={fund} className="grid grid-cols-3 gap-4 items-center">
                          <div 
                            className="text-sm"
                            style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                          >
                            {fund}
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder=""
                              className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 text-center"
                              style={{
                                background: darkMode ? '#1e1e1e' : '#ffffff',
                                borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                                color: darkMode ? '#f1f5f9' : '#18181b'
                              }}
                            />
                            <span 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                              style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                            >
                              %
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder=""
                              className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 text-center"
                              style={{
                                background: darkMode ? '#1e1e1e' : '#ffffff',
                                borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                                color: darkMode ? '#f1f5f9' : '#18181b'
                              }}
                            />
                            <span 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                              style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                            >
                              %
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {/* InRetirement Funds (disabled) */}
                      {['Balance InRetirement', 'Growth InRetirement', 'Prudence InRetirement'].map((fund) => (
                        <div key={fund} className="grid grid-cols-3 gap-4 items-center">
                          <div 
                            className="text-sm"
                            style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                          >
                            {fund}
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder=""
                              disabled
                              className="w-full px-3 py-2 rounded border focus:outline-none pr-8 text-center cursor-not-allowed"
                              style={{
                                background: darkMode ? '#3f3f46' : '#f3f4f6',
                                borderColor: darkMode ? '#52525b' : '#d1d5db',
                                color: darkMode ? '#71717a' : '#9ca3af'
                              }}
                            />
                            <span 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                              style={{ color: darkMode ? '#71717a' : '#9ca3af' }}
                            >
                              %
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder=""
                              disabled
                              className="w-full px-3 py-2 rounded border focus:outline-none pr-8 text-center cursor-not-allowed"
                              style={{
                                background: darkMode ? '#3f3f46' : '#f3f4f6',
                                borderColor: darkMode ? '#52525b' : '#d1d5db',
                                color: darkMode ? '#71717a' : '#9ca3af'
                              }}
                            />
                            <span 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                              style={{ color: darkMode ? '#71717a' : '#9ca3af' }}
                            >
                              %
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual Funds */}
                  <div className="mt-6">
                    <h4 
                      className="text-sm font-medium mb-3"
                      style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                    >
                      Individual Funds
                    </h4>
                    
                    <div className="space-y-3">
                      {['Asia Pacific', 'Balanced Managed', 'Continental European', 'Corporate Bond'].map((fund) => (
                        <div key={fund} className="grid grid-cols-3 gap-4 items-center">
                          <div 
                            className="text-sm"
                            style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                          >
                            {fund}
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder=""
                              className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 text-center"
                              style={{
                                background: darkMode ? '#1e1e1e' : '#ffffff',
                                borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                                color: darkMode ? '#f1f5f9' : '#18181b'
                              }}
                            />
                            <span 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                              style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                            >
                              %
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder=""
                              className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 text-center"
                              style={{
                                background: darkMode ? '#1e1e1e' : '#ffffff',
                                borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                                color: darkMode ? '#f1f5f9' : '#18181b'
                              }}
                            />
                            <span 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                              style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                            >
                              %
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {/* Additional Individual Funds */}
                      {[
                        { name: 'Diversified Assets (FAIF)', disabled: true },
                        { name: 'Diversified Bond', disabled: false },
                        { name: 'Emerging Markets Equity', disabled: false },
                        { name: 'Global Absolute Return', disabled: false },
                        { name: 'Global Emerging Markets', disabled: false },
                        { name: 'Global Equity', disabled: false },
                        { name: 'Global Government Bond', disabled: false },
                        { name: 'Global Government Inflation Linked Bond', disabled: true },
                        { name: 'Global Growth', disabled: false },
                        { name: 'Global High Yield Bond', disabled: false }
                      ].map((fund) => (
                        <div key={fund.name} className="grid grid-cols-3 gap-4 items-center">
                          <div 
                            className="text-sm"
                            style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                          >
                            {fund.name}
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder=""
                              disabled={fund.disabled}
                              className={`w-full px-3 py-2 rounded border focus:outline-none pr-8 text-center ${
                                fund.disabled ? 'cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500'
                              }`}
                              style={{
                                background: fund.disabled 
                                  ? (darkMode ? '#3f3f46' : '#f3f4f6')
                                  : (darkMode ? '#1e1e1e' : '#ffffff'),
                                borderColor: fund.disabled 
                                  ? (darkMode ? '#52525b' : '#d1d5db')
                                  : (darkMode ? '#3f3f46' : '#d1d5db'),
                                color: fund.disabled 
                                  ? (darkMode ? '#71717a' : '#9ca3af')
                                  : (darkMode ? '#f1f5f9' : '#18181b')
                              }}
                            />
                            <span 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                              style={{ 
                                color: fund.disabled 
                                  ? (darkMode ? '#71717a' : '#9ca3af')
                                  : (darkMode ? '#71717a' : '#6b7280')
                              }}
                            >
                              %
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder=""
                              disabled={fund.disabled}
                              className={`w-full px-3 py-2 rounded border focus:outline-none pr-8 text-center ${
                                fund.disabled ? 'cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500'
                              }`}
                              style={{
                                background: fund.disabled 
                                  ? (darkMode ? '#3f3f46' : '#f3f4f6')
                                  : (darkMode ? '#1e1e1e' : '#ffffff'),
                                borderColor: fund.disabled 
                                  ? (darkMode ? '#52525b' : '#d1d5db')
                                  : (darkMode ? '#3f3f46' : '#d1d5db'),
                                color: fund.disabled 
                                  ? (darkMode ? '#71717a' : '#9ca3af')
                                  : (darkMode ? '#f1f5f9' : '#18181b')
                              }}
                            />
                            <span 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                              style={{ 
                                color: fund.disabled 
                                  ? (darkMode ? '#71717a' : '#9ca3af')
                                  : (darkMode ? '#71717a' : '#6b7280')
                              }}
                            >
                              %
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {/* Final Individual Funds */}
                      {[
                        'Global Managed',
                        'Global Quality',
                        'Global Smaller Companies',
                        'Global Value',
                        'Greater European',
                        'International Equity',
                        'Investment Grade Corporate Bond',
                        'Japan',
                        'Managed Growth',
                        'Money Market',
                        'North American',
                        'Strategic Income',
                        'Strategic Managed',
                        'Sustainable & Responsible Equity',
                        'UK',
                        'UK Equity Income',
                        'Worldwide Income'
                      ].map((fund) => (
                        <div key={fund} className="grid grid-cols-3 gap-4 items-center">
                          <div 
                            className="text-sm"
                            style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                          >
                            {fund}
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder=""
                              className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 text-center"
                              style={{
                                background: darkMode ? '#1e1e1e' : '#ffffff',
                                borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                                color: darkMode ? '#f1f5f9' : '#18181b'
                              }}
                            />
                            <span 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                              style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                            >
                              %
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder=""
                              className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 text-center"
                              style={{
                                background: darkMode ? '#1e1e1e' : '#ffffff',
                                borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                                color: darkMode ? '#f1f5f9' : '#18181b'
                              }}
                            />
                            <span 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                              style={{ color: darkMode ? '#71717a' : '#6b7280' }}
                            >
                              %
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Total Section */}
                    <div className="mt-6 pt-4 border-t" style={{ borderColor: darkMode ? '#3f3f46' : '#e5e7eb' }}>
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <div 
                          className="text-sm font-medium"
                          style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                        >
                          Total:
                        </div>
                        <div className="text-center">
                          <span 
                            className="text-sm font-medium"
                            style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                          >
                            100.0%
                          </span>
                        </div>
                        <div className="text-center">
                          <span 
                            className="text-sm font-medium"
                            style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                          >
                            100.0%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 4 && (
            <div className="space-y-6">
              {/* Summary Sections */}
              <div className="grid grid-cols-1 gap-6">
                {/* Account Owner Section */}
                <div 
                  className="p-6 rounded-lg border"
                  style={{
                    background: darkMode ? '#2a2a2a' : '#fafaf9',
                    borderColor: darkMode ? '#3f3f46' : '#e4e4e7'
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 
                      className="text-lg font-semibold"
                      style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                    >
                      Account owner
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <div 
                      className="text-base"
                      style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                    >
                      {formData.title} {formData.forename} {formData.surname}
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: darkMode ? '#a1a1aa' : '#6b7280' }}
                    >
                      Anticipated retirement age: 75
                    </div>
                  </div>
                </div>

                {/* Investments Section */}
                <div 
                  className="p-6 rounded-lg border"
                  style={{
                    background: darkMode ? '#2a2a2a' : '#fafaf9',
                    borderColor: darkMode ? '#3f3f46' : '#e4e4e7'
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 
                      className="text-lg font-semibold"
                      style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                    >
                      Investments
                    </h3>
                    <div className="flex items-center gap-3">
                      <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <HelpCircle size={16} style={{ color: darkMode ? '#71717a' : '#6b7280' }} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium">
                        Edit
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: darkMode ? '#71717a' : '#6b7280' }}>
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <path d="M8 12h8"/>
                          <path d="M12 8v8"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6">
                    {/* Single contributions */}
                    <div>
                      <h4 
                        className="text-sm font-medium mb-2"
                        style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                      >
                        Single contributions
                      </h4>
                      <div 
                        className="text-base"
                        style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                      >
                        None
                      </div>
                    </div>

                    {/* Regular contributions */}
                    <div>
                      <h4 
                        className="text-sm font-medium mb-2"
                        style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                      >
                        Regular contributions
                      </h4>
                      <div 
                        className="text-base"
                        style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                      >
                        None
                      </div>
                    </div>

                    {/* Transfers */}
                    <div>
                      <h4 
                        className="text-sm font-medium mb-2"
                        style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                      >
                        Transfers
                      </h4>
                      <div className="space-y-2">
                        <div 
                          className="text-base"
                          style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                        >
                          Phoenix Life Limited
                        </div>
                        <div 
                          className="text-sm"
                          style={{ color: darkMode ? '#a1a1aa' : '#6b7280' }}
                        >
                          £ 17107.05 (Uncrystallised)
                        </div>
                        <div 
                          className="text-base"
                          style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                        >
                          Aviva
                        </div>
                        <div 
                          className="text-sm"
                          style={{ color: darkMode ? '#a1a1aa' : '#6b7280' }}
                        >
                          £ 6108.92 (Uncrystallised)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefits Section */}
                <div 
                  className="p-6 rounded-lg border"
                  style={{
                    background: darkMode ? '#2a2a2a' : '#fafaf9',
                    borderColor: darkMode ? '#3f3f46' : '#e4e4e7'
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 
                      className="text-lg font-semibold"
                      style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                    >
                      Benefits
                    </h3>
                    <div className="flex items-center gap-3">
                      <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <HelpCircle size={16} style={{ color: darkMode ? '#71717a' : '#6b7280' }} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium">
                        Edit
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: darkMode ? '#71717a' : '#6b7280' }}>
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <path d="M8 12h8"/>
                          <path d="M12 8v8"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {/* Drawdown */}
                    <div>
                      <h4 
                        className="text-sm font-medium mb-2"
                        style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                      >
                        Drawdown
                      </h4>
                      <div 
                        className="text-base"
                        style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                      >
                        None
                      </div>
                    </div>

                    {/* Example annuity */}
                    <div>
                      <h4 
                        className="text-sm font-medium mb-2"
                        style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                      >
                        Example annuity
                      </h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span 
                            className="text-sm"
                            style={{ color: darkMode ? '#a1a1aa' : '#6b7280' }}
                          >
                            Escalation rate:
                          </span>
                          <span 
                            className="text-sm"
                            style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                          >
                            Level
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span 
                            className="text-sm"
                            style={{ color: darkMode ? '#a1a1aa' : '#6b7280' }}
                          >
                            Guarantee period:
                          </span>
                          <span 
                            className="text-sm"
                            style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                          >
                            5 years
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span 
                            className="text-sm"
                            style={{ color: darkMode ? '#a1a1aa' : '#6b7280' }}
                          >
                            Dependant&apos;s pension:
                          </span>
                          <span 
                            className="text-sm"
                            style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                          >
                            Single with no dependants
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Illustration for Retirement Account Section */}
                <div 
                  className="p-6 rounded-lg border"
                  style={{
                    background: darkMode ? '#2a2a2a' : '#fafaf9',
                    borderColor: darkMode ? '#3f3f46' : '#e4e4e7'
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 
                      className="text-lg font-semibold"
                      style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                    >
                      Illustration for Retirement Account new investment (as at 30/04/2033)
                    </h3>
                  </div>
                  
                  {/* Projection Table */}
                  <div className="mb-6">
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div></div>
                      <div 
                        className="text-sm font-medium text-center"
                        style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                      >
                        Lower rate
                      </div>
                      <div 
                        className="text-sm font-medium text-center"
                        style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                      >
                        Mid rate
                      </div>
                      <div 
                        className="text-sm font-medium text-center"
                        style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                      >
                        Higher rate
                      </div>
                    </div>

                    {/* Retirement Account Row */}
                    <div className="grid grid-cols-4 gap-4 items-center mb-3">
                      <div 
                        className="text-sm"
                        style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                      >
                        Retirement Account - Uncrystallised
                      </div>
                      <div 
                        className="text-sm text-center font-medium"
                        style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                      >
                        £19,100
                      </div>
                      <div 
                        className="text-sm text-center font-medium"
                        style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                      >
                        £24,100
                      </div>
                      <div 
                        className="text-sm text-center font-medium"
                        style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                      >
                        £30,200
                      </div>
                    </div>

                    {/* Available tax free cash Row */}
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div 
                        className="text-sm"
                        style={{ color: darkMode ? '#e4e4e7' : '#374151' }}
                      >
                        Available tax free cash:
                      </div>
                      <div 
                        className="text-sm text-center font-medium"
                        style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                      >
                        £4,790
                      </div>
                      <div 
                        className="text-sm text-center font-medium"
                        style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                      >
                        £6,030
                      </div>
                      <div 
                        className="text-sm text-center font-medium"
                        style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}
                      >
                        £7,550
                      </div>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="mb-6">
                    <p 
                      className="text-xs"
                      style={{ color: darkMode ? '#a1a1aa' : '#6b7280' }}
                    >
                      The figures shown above are in today&apos;s money based on an assumed rate of future price inflation of 2% per annum.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t flex justify-end gap-4" style={{ borderColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>
        {activeTab === progressTabs.length - 1 && (
          <button
            type="button"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            Get PDF
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (activeTab < progressTabs.length - 1) {
              setActiveTab(activeTab + 1);
            }
          }}
          disabled={activeTab === progressTabs.length - 1}
          className={`px-6 py-2 rounded font-medium transition-colors ${
            activeTab === progressTabs.length - 1
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {activeTab === progressTabs.length - 1 ? 'Save Illustration' : 'Continue'}
        </button>
      </div>
    </div>
  );
} 