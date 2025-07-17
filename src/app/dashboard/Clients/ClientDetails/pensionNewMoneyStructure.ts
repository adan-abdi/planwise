// Utility to generate Pension New Money folder/file structure
import type { Case } from "../ClientDetails";

export type FolderOrFile = {
  name: string;
  type: "folder" | "file";
  children?: FolderOrFile[];
};

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generatePensionNewMoneyStructure(caseObj: Case): FolderOrFile[] {
  // Ceding folders for each unique provider/transfer (filter out empty names)
  const uniqueProviders = Array.from(new Set((caseObj.transfers || []).map(t => t.provider).filter(Boolean)));
  const cedingFolders = uniqueProviders.map((provider, idx) => ({
    name: `Ceding ${idx + 1}`,
    type: "folder" as const,
    children: [
      { name: "Contribution Instruction", type: "file" as const },
      { name: "Evidence of Funds / Confirmation", type: "file" as const },
      { name: "Provider Correspondence", type: "file" as const },
    ]
  }));

  // Contributions subfolders
  const contributions: FolderOrFile[] = [];
  if (caseObj.single?.checked && caseObj.single.type) {
    contributions.push({
      name: `Single - ${capitalize(caseObj.single.type)}`,
      type: "folder",
      children: [
        { name: "Payment Evidence", type: "file" as const },
        { name: "Type Confirmation", type: "file" as const },
      ]
    });
  }
  if (caseObj.regular?.checked && caseObj.regular.type) {
    contributions.push({
      name: `Regular - ${capitalize(caseObj.regular.type)}`,
      type: "folder",
      children: [
        { name: "Employer Agreement / Payslip", type: "file" as const },
        { name: "Regular Contribution Schedule", type: "file" as const },
      ]
    });
  }

  // ESS Documents folder logic
  let essDocumentsFolder: FolderOrFile | null = null;
  if (caseObj.ess && caseObj.essPartial) {
    essDocumentsFolder = {
      name: "ESS Documents",
      type: "folder",
      children: [
        { name: "ESS Illustration (full + partial)", type: "file" as const },
        { name: "ESS", type: "file" as const },
        { name: "Partial ESS Breakdown", type: "file" as const },
      ]
    };
  } else if (!caseObj.ess && caseObj.essPartial) {
    essDocumentsFolder = {
      name: "ESS Documents",
      type: "folder",
      children: [
        { name: "Partial ESS Breakdown", type: "file" as const },
      ]
    };
  } else if (caseObj.ess && !caseObj.essPartial) {
    essDocumentsFolder = {
      name: "ESS Documents",
      type: "folder",
      children: [
        { name: "ESS", type: "file" as const },
      ]
    };
  }

  return [
    ...cedingFolders,
    ...(essDocumentsFolder ? [essDocumentsFolder] : []),
    {
      name: "Carry Forward",
      type: "folder" as const,
      children: [
        { name: "Carry Forward Calculator / Summary", type: "file" as const },
        { name: "Prior Year Allowance Evidence", type: "file" as const },
        { name: "HMRC Confirmation (if required)", type: "file" as const },
      ]
    },
    {
      name: "Contributions",
      type: "folder" as const,
      children: contributions
    },
    {
      name: "Advice Documents",
      type: "folder" as const,
      children: [
        { name: "Fact Find", type: "file" as const },
        { name: "Suitability Report (New Money Focused)", type: "file" as const },
        { name: "Risk Assessment", type: "file" as const },
        { name: "Fees Disclosure", type: "file" as const },
      ]
    },
    {
      name: "Internal & Compliance",
      type: "folder" as const,
      children: [
        { name: "Adviser Notes", type: "file" as const },
        { name: "Submission Checklist", type: "file" as const },
        { name: "Compliance Review", type: "file" as const },
      ]
    }
  ];
}

export function generateIsaNewMoneyStructure(caseObj: Case): FolderOrFile[] {
  // Ceeding folders for each unique provider/transfer
  const uniqueProviders = Array.from(new Set((caseObj.transfers || []).map(t => t.provider)));
  const ceedingFolders = uniqueProviders.map((provider, idx) => ({
    name: `Ceding ${idx + 1}`,
    type: "folder" as const,
    children: [
      { name: "Proof of Deposit (e.g., bank slip, confirmation)", type: "file" as const },
      { name: "ISA Declaration Form (if required)", type: "file" as const },
      { name: "Provider Communication (if any)", type: "file" as const },
    ]
  }));

  return [
    ...ceedingFolders,
    {
      name: "Advice Documents",
      type: "folder" as const,
      children: [
        { name: "Fact Find", type: "file" as const },
        { name: "ISA Suitability Report", type: "file" as const },
        { name: "Risk Assessment", type: "file" as const },
        { name: "Fees Disclosure", type: "file" as const },
      ]
    },
    {
      name: "Internal & Compliance",
      type: "folder" as const,
      children: [
        { name: "Adviser Notes", type: "file" as const },
        { name: "Submission Checklist", type: "file" as const },
        { name: "Compliance Sign-off", type: "file" as const },
      ]
    }
  ];
} 