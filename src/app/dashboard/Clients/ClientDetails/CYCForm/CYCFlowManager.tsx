import React, { useState } from 'react';
import CYCForm from './CYCForm';
import CYCEntrypoint from './CYCEntrypoint';
import ESSForm from './ESSForm';
import type { Transfer } from '../../ClientDetails';
import type { FolderOrFile } from '../pensionNewMoneyStructure';

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

interface CYCFlowManagerProps {
  initialPlans: Plan[];
  caseData: CaseData;
  darkMode: boolean;
  onFinish: () => void;
  onBack: () => void;
}

interface CaseData {
  id: string;
  createdAt: string;
  caseType: string;
  transfers: Transfer[];
  ess?: boolean;
  essPartial?: boolean;
  documents?: FolderOrFile[];
  single?: { checked: boolean; type: 'personal' | 'employer' | null };
  regular?: { checked: boolean; type: 'personal' | 'employer' | null };
  carryForward?: boolean;
}

// Function to map ESS data from case to ESS plans
function mapCaseDataToESSPlans(caseData: CaseData): ESS[] {
  const essPlans: ESS[] = [];
  
  // If ESS is enabled, create ESS entries based on the case data
  if (caseData.ess) {
    // Try to extract employer/provider information from transfers
    const providers = caseData.transfers?.map(t => t.provider).filter(Boolean) || [];
    
    if (providers.length > 0) {
      // For Pension Transfer cases with ESS, create more meaningful entries
      if (caseData.caseType === 'Pension Transfer') {
        if (caseData.ess && caseData.essPartial) {
          // Both ESS and ESS Partial - create two entries
          essPlans.push({
            employerName: 'Current Employer',
            schemeProvider: providers[0] || 'Current Provider',
            complete: false
          });
          
          if (providers.length > 1) {
            essPlans.push({
              employerName: 'Previous Employer',
              schemeProvider: providers[1],
              complete: false
            });
          } else {
            essPlans.push({
              employerName: 'Previous Employer',
              schemeProvider: 'Previous Provider',
              complete: false
            });
          }
        } else if (caseData.ess && !caseData.essPartial) {
          // Only ESS (full) - create one entry
          essPlans.push({
            employerName: 'Current Employer',
            schemeProvider: providers[0] || 'Current Provider',
            complete: false
          });
        }
      } else {
        // For other case types, use simpler mapping
        essPlans.push({
          employerName: 'Current Employer',
          schemeProvider: providers[0] || 'Current Provider',
          complete: false
        });
        
        if (caseData.essPartial && providers.length > 1) {
          essPlans.push({
            employerName: 'Previous Employer',
            schemeProvider: providers[1],
            complete: false
          });
        } else if (caseData.essPartial) {
          essPlans.push({
            employerName: 'Previous Employer',
            schemeProvider: 'Previous Provider',
            complete: false
          });
        }
      }
    } else {
      // Fallback if no providers are available
      if (caseData.ess && caseData.essPartial) {
        essPlans.push({
          employerName: 'Current Employer',
          schemeProvider: 'Current Provider',
          complete: false
        });
        essPlans.push({
          employerName: 'Previous Employer',
          schemeProvider: 'Previous Provider',
          complete: false
        });
      } else if (caseData.ess) {
        essPlans.push({
          employerName: 'Current Employer',
          schemeProvider: 'Current Provider',
          complete: false
        });
      }
    }
  }
  
  return essPlans;
}

export default function CYCFlowManager({ initialPlans, caseData, darkMode, onFinish, onBack }: CYCFlowManagerProps) {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [essPlans, setEssPlans] = useState<ESS[]>(mapCaseDataToESSPlans(caseData));
  const [currentPlanIndex, setCurrentPlanIndex] = useState<number | null>(0); // null = not editing, show summary
  const [lastFormStage, setLastFormStage] = useState<number>(0); // Track which stage we came from (default to stage 0 - BasicDetailsStage)
  const [currentESSIndex, setCurrentESSIndex] = useState<number | null>(null); // null = not editing ESS, show summary
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true); // Track if this is the first time opening

  // Handler to save a plan (from CYCForm)
  const handleSavePlan = (updatedPlan: Plan, currentStage: number) => {
    setPlans(prev => {
      const newPlans = [...prev];
      if (currentPlanIndex !== null) newPlans[currentPlanIndex] = updatedPlan;
      return newPlans;
    });
    
    // Navigate based on current stage
    if (currentStage === 0) {
      // If we're on stage 0 (Basic Details), go to stage 1 (Existing Plans)
      setLastFormStage(1);
      // Stay in the form but move to next stage - the CYCForm will handle this via useEffect
    } else if (currentStage === 1) {
      // If we're on stage 1 (Existing Plans), go to entrypoint (summary)
      setCurrentPlanIndex(null); // Go to summary after save
    } else if (currentStage === 2) {
      // If we're on stage 2 (Recommended Plan), go to stage 3 (Results)
      setLastFormStage(3);
      // Stay in the form but move to next stage - the CYCForm will handle this via useEffect
    } else if (currentStage === 3) {
      // If we're on stage 3 (Results), switch to Illustrations stage
      onFinish(); // This will switch to Illustrations stage
    } else {
      // For other stages, default to going to summary
      setCurrentPlanIndex(null);
    }
  };

  // Handler to start editing a plan (from summary)
  const handleEditPlan = (idx: number) => {
    setCurrentPlanIndex(idx);
    setLastFormStage(1); // Go to stage 1 (Existing Plans) when editing
  };

  // Handler to add another plan (from summary)
  const handleAddAnotherPlan = () => {
    // Find first incomplete plan
    const nextIdx = plans.findIndex(p => !p.complete);
    if (nextIdx !== -1) {
      setCurrentPlanIndex(nextIdx);
    } else {
      // Optionally, add a new blank plan
      setPlans(prev => [...prev, { planName: '', planNumber: '', fundValue: '', transferValue: '', regularContribution: '', frequency: '', complete: false }]);
      setCurrentPlanIndex(plans.length);
    }
    setLastFormStage(1); // Go to stage 1 (Existing Plans) when adding another plan
  };

  // Handler to finish and continue
  const handleFinish = () => {
    // Go to CYCForm stage 2 (Recommended Plan)
    if (plans.length > 0) {
      setCurrentPlanIndex(0); // Go to the first plan
      setLastFormStage(2); // Set the stage to 2 (Recommended Plan)
    } else {
      // If no plans exist, create a new one and go to it
      setPlans([{ planName: '', planNumber: '', fundValue: '', transferValue: '', regularContribution: '', frequency: '', complete: false }]);
      setCurrentPlanIndex(0);
      setLastFormStage(2); // Set the stage to 2 (Recommended Plan)
    }
  };

  // Handler to go back (from summary)
  const handleBack = () => {
    // Call the onBack prop to navigate back
    onBack();
  };

  // Handler to close (from summary)
  const handleClose = () => {
    // This could close the modal or navigate back
    console.log('Close button clicked');
  };

  // Handler to add ESS
  const handleAddESS = () => {
    // Create a new ESS entry and open the form
    const newESS: ESS = { employerName: '', schemeProvider: '', complete: false };
    setEssPlans(prev => [...prev, newESS]);
    setCurrentESSIndex(essPlans.length); // Set to the index of the new ESS
  };

  // Handler to edit ESS
  const handleEditESS = (idx: number) => {
    setCurrentESSIndex(idx);
  };

  // Handler to save ESS
  const handleSaveESS = (updatedESS: ESS) => {
    setEssPlans(prev => {
      const newESSPlans = [...prev];
      if (currentESSIndex !== null) {
        newESSPlans[currentESSIndex] = updatedESS;
      }
      return newESSPlans;
    });
    setCurrentESSIndex(null); // Go back to summary (CYCEntrypoint)
  };

  // Handler to cancel ESS editing
  const handleCancelESS = () => {
    setCurrentESSIndex(null); // Go back to summary
  };

  // Handler to remove plan
  const handleRemovePlan = (idx: number) => {
    setPlans(prev => prev.filter((_, i) => i !== idx));
  };

  // If editing an ESS, show the ESS form
  if (currentESSIndex !== null) {
    return (
      <ESSForm
        darkMode={darkMode}
        ess={essPlans[currentESSIndex]}
        onSave={handleSaveESS}
        onCancel={handleCancelESS}
      />
    );
  }

  // If editing a plan, show the CYC form
  if (currentPlanIndex !== null) {
    return (
      <CYCForm
        darkMode={darkMode}
        plan={plans[currentPlanIndex]}
        onSave={handleSavePlan}
        initialStage={lastFormStage}
      />
    );
  }

  // If this is the first time opening, go directly to CYCForm stage 0
  if (isFirstTime) {
    setIsFirstTime(false);
    return (
      <CYCForm
        darkMode={darkMode}
        plan={plans[0] || { planName: '', planNumber: '', fundValue: '', transferValue: '', regularContribution: '', frequency: '', complete: false }}
        onSave={handleSavePlan}
        initialStage={0}
      />
    );
  }

  // Otherwise, show the summary (CYCEntrypoint)
  return (
    <CYCEntrypoint
      plans={plans}
      essPlans={essPlans}
      onEditPlan={handleEditPlan}
      onAddAnotherPlan={handleAddAnotherPlan}
      onFinish={handleFinish}
      onBack={handleBack}
      onClose={handleClose}
      onAddESS={handleAddESS}
      onEditESS={handleEditESS}
      onRemovePlan={handleRemovePlan}
      darkMode={darkMode}
    />
  );
} 