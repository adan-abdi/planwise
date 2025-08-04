import React from "react";
import 'react-datepicker/dist/react-datepicker.css';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../../../theme-context';
import { getPartners, Partner } from '../../../api/services/partners';
import { createClient, CreateClientRequest } from '../../../api/services/clients';

export interface ClientFormData {
  clientName: string;
  advisorName: string;
  pensionTransfer: number;
  isaTransfer: number;
  pensionNewMoney: number;
  isaNewMoney: number;
}

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: ClientFormData) => void;
}

export default function ClientModal({ open, onClose, onSubmit }: ClientModalProps) {
  const [clientName, setClientName] = React.useState("");
  const [advisorName, setAdvisorName] = React.useState("");
  const [advisors, setAdvisors] = React.useState<Partner[]>([]);
  const [isLoadingAdvisors, setIsLoadingAdvisors] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { darkMode } = useTheme();

  const resetForm = () => {
    setClientName("");
    setAdvisorName("");
  };

  // Restore advisor fetching with proper safeguards
  React.useEffect(() => {
    if (open && advisors.length === 0) {
      const fetchAdvisors = async () => {
        setIsLoadingAdvisors(true);
        try {
          const response = await getPartners(1, 50); // Get up to 50 advisors
          if (response.status && response.data) {
            setAdvisors(response.data);
          }
        } catch (error) {
          console.error('Error fetching advisors:', error);
        } finally {
          setIsLoadingAdvisors(false);
        }
      };

      fetchAdvisors();
    }
  }, [open, advisors.length]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the selected advisor to get their ID
    const selectedAdvisor = advisors.find(advisor => advisor.name === advisorName);
    if (!selectedAdvisor) {
      console.error('No advisor selected');
      return;
    }

    setIsSubmitting(true);
    try {
      const clientData: CreateClientRequest = {
        name: clientName,
        partnerId: selectedAdvisor.id
      };

      const response = await createClient(clientData);
      
      if (response.status) {
        // Call the onSubmit callback with the created client data
        if (onSubmit) {
          onSubmit({
            clientName,
            advisorName,
            pensionTransfer: 0, // removed from form, set to 0
            isaTransfer: 0,    // removed from form, set to 0
            pensionNewMoney: 0, // removed from form, set to 0
            isaNewMoney: 0,     // removed from form, set to 0
          });
        }
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error('Error creating client:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const isFormValid =
    clientName.trim() !== '' &&
    advisorName.trim() !== '';



  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-0 overflow-y-auto backdrop-blur-lg transition-all ${darkMode ? 'bg-zinc-900/30' : 'bg-white/20'}`}>
      <div className="bg-[var(--background)] rounded-2xl shadow-2xl w-full max-w-xl relative border border-[var(--border)] flex flex-col mx-auto my-2 sm:my-0 max-h-[80vh] overflow-visible">
        <div className="px-4 sm:px-6 py-2 border-b border-[var(--border)] rounded-t-2xl bg-[var(--muted)] dark:bg-[var(--muted)]">
          <span className="text-zinc-400 font-medium text-base">Create new client</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-0 px-4 sm:px-6 pt-3 pb-1 space-y-2">
          <div className="mb-3 w-full">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1 text-left">Client name</label>
            <input
              type="text"
              placeholder="Enter client name"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              className="w-full border border-[var(--border)] rounded-lg px-4 py-2 text-base bg-[var(--background)] dark:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-zinc-400 text-left text-[var(--foreground)]"
            />
          </div>
          <div className="mb-3 w-full">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1 text-left">Advisor name</label>
            <div className="relative flex items-center w-full">
              <select
                value={advisorName}
                onChange={e => setAdvisorName(e.target.value)}
                className="appearance-none w-full border border-[var(--border)] rounded-lg px-4 py-2 pr-12 text-base bg-[var(--background)] dark:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-[var(--foreground)] placeholder-zinc-400 text-left cursor-pointer transition hover:border-blue-400"
                style={{ minHeight: '44px' }}
                disabled={isLoadingAdvisors}
              >
                <option value="" disabled>
                  {isLoadingAdvisors ? 'Loading advisors...' : 'Select an advisor'}
                </option>
                {advisors.map(advisor => (
                  <option key={advisor.id} value={advisor.name}>{advisor.name}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 flex items-center h-full">
                <ChevronDown className="w-5 h-5 text-zinc-400" />
              </span>
            </div>
          </div>
          <div className="flex flex-row justify-end gap-2 py-3 rounded-b-2xl bg-[var(--background)]">
            <button type="button" onClick={handleCancel} 
              className="px-4 py-2 rounded-lg text-base font-medium transition w-full sm:w-auto mb-2 sm:mb-0 border"
              style={{
                backgroundColor: 'var(--muted)',
                color: '#18181b',
                borderColor: 'var(--border)',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f4f4f5'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-base font-medium transition w-full sm:w-auto ${isFormValid && !isSubmitting ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' : 'bg-zinc-300 text-zinc-500 cursor-not-allowed'}`}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create new client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 