import React from 'react';
import { useTheme } from '../../../../../theme-context';
import { ChevronLeft, Plus, Edit3, Trash2, CheckCircle, XCircle } from 'lucide-react';

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

interface ExistingPlansSummaryProps {
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

const ExistingPlansSummary: React.FC<ExistingPlansSummaryProps> = ({ 
  plans, 
  essPlans, 
  onEditPlan, 
  onAddAnotherPlan, 
  onFinish, 
  onBack, 
  onAddESS, 
  onEditESS, 
  onRemovePlan, 
  darkMode 
}) => {
  const { darkMode: themeDarkMode } = useTheme();
  const isDark = darkMode || themeDarkMode;

  return (
    <div 
      className="w-full h-full min-h-screen flex flex-col"
      style={{
        background: isDark ? 'var(--background)' : '#ffffff',
      }}
    >
      {/* Header with simple border */}
      <div 
        className="sticky top-0 z-10 border-b"
        style={{
          backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
          borderColor: isDark ? '#3f3f46' : '#e4e4e7',
        }}
      >
        <div className="flex justify-start items-center p-6">
          <div className="flex items-center gap-4">
            <h2 
              className="text-2xl font-semibold"
              style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}
            >
              Existing Plans: Summary
            </h2>
            <div 
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                color: isDark ? '#60a5fa' : '#2563eb',
                border: `1px solid ${isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(37, 99, 235, 0.2)'}`,
              }}
            >
              {plans.length + essPlans.length} plans
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Description */}
        <div 
          className="p-4 rounded-xl backdrop-blur-lg border text-left"
          style={{
            backgroundColor: isDark ? 'rgba(39, 39, 42, 0.85)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(12px) saturate(150%)',
            WebkitBackdropFilter: 'blur(12px) saturate(150%)',
          }}
        >
          <p 
            className="text-sm leading-relaxed"
            style={{ color: isDark ? '#a1a1aa' : '#64748b' }}
          >
            The table below summarises plans you have added so far. You can add more plans or continue to the next step. Select any transfer value or regular contribution to edit the corresponding page.
          </p>
        </div>
        
        {/* Plans to be replaced section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 
              className="text-lg font-semibold flex items-center gap-2"
              style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}
            >
              Plans to be replaced
              <span 
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                  color: isDark ? '#4ade80' : '#16a34a',
                }}
              >
                {plans.length}
              </span>
            </h3>
          </div>

          {/* Plans Table */}
          <div className={`overflow-x-auto w-full px-0 sm:pt-0 scrollbar-thin border rounded-lg ${isDark ? 'border-zinc-700 bg-[var(--background)]' : 'border-zinc-200 bg-white'}`} style={{marginBottom: '1rem'}}>
            <table className={`w-full text-[10px] sm:text-xs text-left border-collapse ${isDark ? 'text-[var(--foreground)]' : ''}`}>
              <thead className={`font-semibold bg-gradient-to-r border-b ${isDark ? 'text-[var(--foreground)] from-zinc-800 to-zinc-900 border-zinc-700' : 'text-zinc-700 from-zinc-50 to-zinc-100 border-zinc-200'}`}>
                <tr className="h-10 sm:h-12">
                  <th className="p-2 align-middle border-r text-left select-none" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                    <span style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>#</span>
                  </th>
                  <th className="p-2 align-middle border-r text-left select-none" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                    <span style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Plan name</span>
                  </th>
                  <th className="p-2 align-middle border-r text-left select-none" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                    <span style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Plan number</span>
                  </th>
                  <th className="p-2 align-middle border-r text-left select-none" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                    <span style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Fund Value</span>
                  </th>
                  <th className="p-2 align-middle border-r text-left select-none" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                    <span style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Transfer value</span>
                  </th>
                  <th className="p-2 align-middle border-r text-left select-none" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                    <span style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Regular contribution</span>
                  </th>
                  <th className="p-2 align-middle border-r text-left select-none" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                    <span style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Frequency</span>
                  </th>
                  <th className="p-2 align-middle border-r text-left select-none" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                    <span style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Status</span>
                  </th>
                  <th className="p-2 align-middle text-left font-semibold" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, idx) => (
                  <tr
                    key={idx}
                    className={`border-b h-7 sm:h-7 transition-all duration-200 ${isDark ? 'border-zinc-700 bg-[var(--background)] hover:bg-zinc-800/50' : 'border-zinc-100 bg-white hover:bg-zinc-50'}`}
                  >
                    <td className="p-2 align-middle border-r" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                      <div className="text-zinc-600 text-xs">{idx + 1}</div>
                    </td>
                    <td className="p-2 align-middle border-r" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                      <div className="font-semibold text-zinc-900">{plan.planName || '-'}</div>
                    </td>
                    <td className="p-2 align-middle border-r" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                      <div className="text-zinc-600 text-xs">{plan.planNumber || '-'}</div>
                    </td>
                    <td className="p-2 align-middle border-r" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                      <div className="text-zinc-600 text-xs">{plan.fundValue || '-'}</div>
                    </td>
                    <td className="p-2 align-middle border-r" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                      <button
                        className="text-sm hover:underline transition-colors duration-200"
                        onClick={() => onEditPlan(idx)}
                        style={{ color: isDark ? '#60a5fa' : '#2563eb' }}
                      >
                        {plan.transferValue || '-'}
                      </button>
                    </td>
                    <td className="p-2 align-middle border-r" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                      <button
                        className="text-sm hover:underline transition-colors duration-200"
                        onClick={() => onEditPlan(idx)}
                        style={{ color: isDark ? '#60a5fa' : '#2563eb' }}
                      >
                        {plan.regularContribution || '-'}
                      </button>
                    </td>
                    <td className="p-2 align-middle border-r" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                      <div className="text-zinc-600 text-xs">{plan.frequency || '-'}</div>
                    </td>
                    <td className="p-2 align-middle border-r" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                      <div className="flex items-center gap-2">
                        {plan.complete ? (
                          <CheckCircle className="w-4 h-4" style={{ color: isDark ? '#4ade80' : '#16a34a' }} />
                        ) : (
                          <XCircle className="w-4 h-4" style={{ color: isDark ? '#f87171' : '#dc2626' }} />
                        )}
                        <span className="text-xs" style={{ color: isDark ? (plan.complete ? '#4ade80' : '#f87171') : (plan.complete ? '#16a34a' : '#dc2626') }}>
                          {plan.complete ? 'Complete' : 'Incomplete'}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 align-middle">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 rounded transition-colors duration-200"
                          onClick={() => onEditPlan(idx)}
                          style={{
                            color: isDark ? '#60a5fa' : '#2563eb',
                            backgroundColor: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(96, 165, 250, 0.2)' : 'rgba(37, 99, 235, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)';
                          }}
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          className="p-1 rounded transition-colors duration-200"
                          onClick={() => onRemovePlan(idx)}
                          style={{
                            color: isDark ? '#f87171' : '#dc2626',
                            backgroundColor: isDark ? 'rgba(248, 113, 113, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(248, 113, 113, 0.2)' : 'rgba(220, 38, 38, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(248, 113, 113, 0.1)' : 'rgba(220, 38, 38, 0.1)';
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Plan Button */}
          <div className="flex justify-start">
            <button
              className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-out flex items-center justify-center gap-2"
              onClick={onAddAnotherPlan}
              style={{
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                color: isDark ? '#60a5fa' : '#2563eb',
                border: `1px solid ${isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(37, 99, 235, 0.2)'}`,
                backdropFilter: 'blur(12px) saturate(150%)',
                WebkitBackdropFilter: 'blur(12px) saturate(150%)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)';
                e.currentTarget.style.transform = 'scale(1.01)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Plus className="w-4 h-4" />
              Add another plan to be replaced
            </button>
          </div>
        </div>

        {/* Instructional message */}
        <div 
          className="p-4 rounded-xl backdrop-blur-lg border"
          style={{
            backgroundColor: isDark ? 'rgba(127, 29, 29, 0.4)' : 'rgba(254, 242, 242, 0.95)',
            color: isDark ? '#fca5a5' : '#dc2626',
            borderColor: isDark ? 'rgba(153, 27, 27, 0.3)' : 'rgba(254, 202, 202, 0.5)',
            backdropFilter: 'blur(12px) saturate(150%)',
            WebkitBackdropFilter: 'blur(12px) saturate(150%)',
          }}
        >
          <p className="text-sm">
            If only the ESS is being replaced, you do not need to complete the ESS details in the section below.
          </p>
        </div>

        {/* ESS section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 
              className="text-lg font-semibold flex items-center gap-2"
              style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}
            >
              Employer Sponsored Schemes
              <span 
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.1)',
                  color: isDark ? '#a855f7' : '#9333ea',
                }}
              >
                {essPlans.length}
              </span>
            </h3>
          </div>

          {/* ESS Table */}
          <div className={`overflow-x-auto w-full px-0 sm:pt-0 scrollbar-thin border rounded-lg ${isDark ? 'border-zinc-700 bg-[var(--background)]' : 'border-zinc-200 bg-white'}`} style={{marginBottom: '1rem'}}>
            <table className={`w-full text-[10px] sm:text-xs text-left border-collapse ${isDark ? 'text-[var(--foreground)]' : ''}`}>
              <thead className={`font-semibold bg-gradient-to-r border-b ${isDark ? 'text-[var(--foreground)] from-zinc-800 to-zinc-900 border-zinc-700' : 'text-zinc-700 from-zinc-50 to-zinc-100 border-zinc-200'}`}>
                <tr className="h-10 sm:h-12">
                  <th className="p-2 align-middle border-r text-left select-none" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                    <span style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Employer name</span>
                  </th>
                  <th className="p-2 align-middle border-r text-left select-none" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                    <span style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Scheme provider</span>
                  </th>
                  <th className="p-2 align-middle border-r text-left select-none" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                    <span style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Status</span>
                  </th>
                  <th className="p-2 align-middle text-left font-semibold" style={{ color: isDark ? 'var(--foreground)' : '#18181b' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {essPlans.map((ess, idx) => (
                  <tr
                    key={idx}
                    className={`border-b h-7 sm:h-7 transition-all duration-200 ${isDark ? 'border-zinc-700 bg-[var(--background)] hover:bg-zinc-800/50' : 'border-zinc-100 bg-white hover:bg-zinc-50'}`}
                  >
                    <td className="p-2 align-middle border-r" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                      <div className="font-semibold text-zinc-900">{ess.employerName || '-'}</div>
                    </td>
                    <td className="p-2 align-middle border-r" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                      <div className="text-zinc-600 text-xs">{ess.schemeProvider || '-'}</div>
                    </td>
                    <td className="p-2 align-middle border-r" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                      <div className="flex items-center gap-2">
                        {ess.complete ? (
                          <CheckCircle className="w-4 h-4" style={{ color: isDark ? '#4ade80' : '#16a34a' }} />
                        ) : (
                          <XCircle className="w-4 h-4" style={{ color: isDark ? '#f87171' : '#dc2626' }} />
                        )}
                        <span className="text-xs" style={{ color: isDark ? (ess.complete ? '#4ade80' : '#f87171') : (ess.complete ? '#16a34a' : '#dc2626') }}>
                          {ess.complete ? 'Complete' : 'Incomplete'}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 align-middle">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 rounded transition-colors duration-200"
                          onClick={() => onEditESS(idx)}
                          style={{
                            color: isDark ? '#60a5fa' : '#2563eb',
                            backgroundColor: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(96, 165, 250, 0.2)' : 'rgba(37, 99, 235, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)';
                          }}
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          className="p-1 rounded transition-colors duration-200"
                          onClick={() => onRemovePlan(idx)}
                          style={{
                            color: isDark ? '#f87171' : '#dc2626',
                            backgroundColor: isDark ? 'rgba(248, 113, 113, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(248, 113, 113, 0.2)' : 'rgba(220, 38, 38, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(248, 113, 113, 0.1)' : 'rgba(220, 38, 38, 0.1)';
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add ESS Button */}
          <div className="flex justify-start">
            <button
              className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-out flex items-center justify-center gap-2"
              onClick={onAddESS}
              style={{
                backgroundColor: isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.05)',
                color: isDark ? '#a855f7' : '#9333ea',
                border: `1px solid ${isDark ? 'rgba(168, 85, 247, 0.3)' : 'rgba(147, 51, 234, 0.2)'}`,
                backdropFilter: 'blur(12px) saturate(150%)',
                WebkitBackdropFilter: 'blur(12px) saturate(150%)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.1)';
                e.currentTarget.style.transform = 'scale(1.01)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.05)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Plus className="w-4 h-4" />
              Add Employer Sponsored Scheme
            </button>
          </div>
        </div>
      </div>

      {/* Footer Actions with simple border */}
      <div 
        className="sticky bottom-0 z-10 border-t"
        style={{
          backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
          borderColor: isDark ? '#3f3f46' : '#e4e4e7',
        }}
      >
        <div className="flex justify-between items-center p-6">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out flex items-center gap-2"
            style={{
              backgroundColor: isDark ? 'rgba(39, 39, 42, 0.6)' : 'rgba(248, 250, 252, 0.8)',
              color: isDark ? 'var(--foreground)' : '#18181b',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
              backdropFilter: 'blur(12px) saturate(150%)',
              WebkitBackdropFilter: 'blur(12px) saturate(150%)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(63, 63, 70, 0.8)' : 'rgba(241, 245, 249, 0.9)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(39, 39, 42, 0.6)' : 'rgba(248, 250, 252, 0.8)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-normal bg-blue-600 text-white transition border border-blue-600 hover:bg-blue-700 hover:border-blue-700"
            onClick={onFinish}
          >
            Save and Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExistingPlansSummary; 