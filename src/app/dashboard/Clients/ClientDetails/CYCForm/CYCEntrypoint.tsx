import React from 'react';
import { useTheme } from '../../../../../theme-context';

interface Plan {
  planName: string;
  planNumber: string;
  fundValue: string;
  transferValue: string;
  regularContribution: string;
  frequency: string;
  complete: boolean;
}

interface ESS {
  employerName: string;
  schemeProvider: string;
  complete: boolean;
}

interface CYCEntrypointProps {
  plans: Plan[];
  essPlans: ESS[];
  onEditPlan: (idx: number) => void;
  onAddAnotherPlan: () => void;
  onFinish: () => void;
  onBack: () => void;
  onClose: () => void;
  onAddESS: () => void;
  onEditESS: (idx: number) => void;
  onRemovePlan: (idx: number) => void;
  darkMode: boolean;
}

const CYCEntrypoint: React.FC<CYCEntrypointProps> = ({ 
  plans, 
  essPlans, 
  onEditPlan, 
  onAddAnotherPlan, 
  onFinish, 
  onBack, 
  onClose, 
  onAddESS, 
  onEditESS, 
  onRemovePlan, 
  darkMode 
}) => {
  const { darkMode: themeDarkMode } = useTheme();
  const isDark = darkMode || themeDarkMode;

  return (
    <div 
      className="w-full h-full min-h-screen rounded-lg shadow-sm p-8 mt-8"
      style={{
        background: isDark ? 'var(--background)' : 'white',
        border: `1px solid ${isDark ? 'var(--border)' : '#e4e4e7'}`,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 
          className="text-2xl font-semibold"
          style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}
        >
          Existing Plans: Summary
        </h2>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-medium transition"
          style={{
            backgroundColor: '#2563eb',
            color: '#fff',
            boxShadow: '0 1px 4px 0 rgba(24,80,255,0.10)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
        >
          Close
        </button>
      </div>

      {/* Description */}
      <p 
        className="mb-6 text-base"
        style={{ color: isDark ? '#a1a1aa' : '#64748b' }}
      >
        The table below summarises plans you have added so far. You can add more plans or continue to the next step. Select any transfer value or regular contribution to edit the corresponding page.
      </p>
      
      {/* Plans to be replaced section */}
      <div 
        className="mb-4 font-medium text-base"
        style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}
      >
        Plans to be replaced
      </div>
      <div className="overflow-x-auto mb-6">
        <table 
          className="min-w-full rounded-lg"
          style={{
            border: `1px solid ${isDark ? 'var(--border)' : '#e4e4e7'}`,
          }}
        >
          <thead 
            className="rounded-t-lg"
            style={{ background: isDark ? '#27272a' : '#f4f4f5' }}
          >
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Plan name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Plan number</th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Fund Value</th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Transfer value<br/>(Select to edit)</th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Regular contribution<br/>(Select to edit)</th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Frequency</th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Complete</th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}></th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, idx) => (
              <tr 
                key={idx} 
                className="border-b last:border-b-0"
                style={{ 
                  background: isDark ? 'var(--background)' : 'white',
                  borderColor: isDark ? 'var(--border)' : '#e4e4e7'
                }}
              >
                <td className="px-4 py-3 align-middle" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>{idx + 1}</td>
                <td className="px-4 py-3 align-middle" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>{plan.planName || <span style={{ color: isDark ? '#52525b' : '#a1a1aa' }}>-</span>}</td>
                <td className="px-4 py-3 align-middle" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>{plan.planNumber || <span style={{ color: isDark ? '#52525b' : '#a1a1aa' }}>-</span>}</td>
                <td className="px-4 py-3 align-middle" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>{plan.fundValue || <span style={{ color: isDark ? '#52525b' : '#a1a1aa' }}>-</span>}</td>
                <td className="px-4 py-3 align-middle">
                  <button
                    className="text-blue-600 underline text-sm hover:text-blue-800 transition-colors"
                    onClick={() => onEditPlan(idx)}
                    style={{ color: isDark ? '#60a5fa' : '#2563eb' }}
                  >
                    {plan.transferValue || <span style={{ color: isDark ? '#52525b' : '#a1a1aa' }}>-</span>}
                  </button>
                </td>
                <td className="px-4 py-3 align-middle">
                  <button
                    className="text-blue-600 underline text-sm hover:text-blue-800 transition-colors"
                    onClick={() => onEditPlan(idx)}
                    style={{ color: isDark ? '#60a5fa' : '#2563eb' }}
                  >
                    {plan.regularContribution || <span style={{ color: isDark ? '#52525b' : '#a1a1aa' }}>-</span>}
                  </button>
                </td>
                <td className="px-4 py-3 align-middle" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>{plan.frequency || <span style={{ color: isDark ? '#52525b' : '#a1a1aa' }}>-</span>}</td>
                <td className="px-4 py-3 align-middle" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>{plan.complete ? 'yes' : <span style={{ color: isDark ? '#52525b' : '#a1a1aa' }}>no</span>}</td>
                <td className="px-4 py-3 align-middle">
                  <button
                    className="text-red-600 underline text-sm hover:text-red-800 transition-colors"
                    onClick={() => onRemovePlan(idx)}
                    style={{ color: isDark ? '#f87171' : '#dc2626' }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Plan Button */}
      <button
        className="mb-8 px-4 py-2 rounded-lg text-sm font-medium transition"
        onClick={onAddAnotherPlan}
        style={{
          backgroundColor: 'transparent',
          color: isDark ? '#60a5fa' : '#2563eb',
          border: `1px solid ${isDark ? '#60a5fa' : '#2563eb'}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isDark ? '#1e3a8a' : '#eff6ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        Add another plan to be replaced
      </button>

      {/* Instructional message */}
      <div 
        className="mb-6 p-4 rounded-lg"
        style={{
          background: isDark ? '#7f1d1d' : '#fef2f2',
          color: isDark ? '#fca5a5' : '#dc2626',
          border: `1px solid ${isDark ? '#991b1b' : '#fecaca'}`,
        }}
      >
        If only the ESS is being replaced, you do not need to complete the ESS details in the section below.
      </div>

      {/* ESS section */}
      <div 
        className="mb-4 font-medium text-base"
        style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}
      >
        Employer Sponsored Schemes
      </div>
      <div className="overflow-x-auto mb-6">
        <table 
          className="min-w-full rounded-lg"
          style={{
            border: `1px solid ${isDark ? 'var(--border)' : '#e4e4e7'}`,
          }}
        >
          <thead 
            className="rounded-t-lg"
            style={{ background: isDark ? '#27272a' : '#f4f4f5' }}
          >
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Employer name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Scheme provider</th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Complete</th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}></th>
              <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}></th>
            </tr>
          </thead>
          <tbody>
            {essPlans.map((ess, idx) => (
              <tr 
                key={idx} 
                className="border-b last:border-b-0"
                style={{ 
                  background: isDark ? 'var(--background)' : 'white',
                  borderColor: isDark ? 'var(--border)' : '#e4e4e7'
                }}
              >
                <td className="px-4 py-3 align-middle" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>{ess.employerName || <span style={{ color: isDark ? '#52525b' : '#a1a1aa' }}>-</span>}</td>
                <td className="px-4 py-3 align-middle" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>{ess.schemeProvider || <span style={{ color: isDark ? '#52525b' : '#a1a1aa' }}>-</span>}</td>
                <td className="px-4 py-3 align-middle" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>{ess.complete ? 'yes' : <span style={{ color: isDark ? '#52525b' : '#a1a1aa' }}>no</span>}</td>
                <td className="px-4 py-3 align-middle">
                  <button
                    className="text-blue-600 underline text-sm hover:text-blue-800 transition-colors"
                    onClick={() => onEditESS(idx)}
                    style={{ color: isDark ? '#60a5fa' : '#2563eb' }}
                  >
                    Edit
                  </button>
                </td>
                <td className="px-4 py-3 align-middle">
                  <button
                    className="text-red-600 underline text-sm hover:text-red-800 transition-colors"
                    onClick={() => onRemovePlan(idx)}
                    style={{ color: isDark ? '#f87171' : '#dc2626' }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add ESS Button */}
      <button
        className="mb-8 px-4 py-2 rounded-lg text-sm font-medium transition"
        onClick={onAddESS}
        style={{
          backgroundColor: 'transparent',
          color: isDark ? '#60a5fa' : '#2563eb',
          border: `1px solid ${isDark ? '#60a5fa' : '#2563eb'}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isDark ? '#1e3a8a' : '#eff6ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        Add Employer Sponsored Scheme
      </button>

      {/* Footer Actions */}
      <div className="flex justify-between mt-8 pt-6" style={{ borderTop: `1px solid ${isDark ? 'var(--border)' : '#e4e4e7'}` }}>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
          style={{
            backgroundColor: 'transparent',
            color: isDark ? 'var(--foreground)' : '#18181b',
            border: `1px solid ${isDark ? 'var(--border)' : '#e4e4e7'}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isDark ? '#27272a' : '#f4f4f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          className="px-6 py-2 rounded-lg text-base font-semibold transition"
          onClick={onFinish}
          style={{
            backgroundColor: '#2563eb',
            color: '#fff',
            boxShadow: '0 1px 4px 0 rgba(24,80,255,0.10)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
        >
          Finish adding plans and continue
        </button>
      </div>
    </div>
  );
};

export default CYCEntrypoint;
