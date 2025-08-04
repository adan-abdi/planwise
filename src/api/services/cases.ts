import { apiFetch } from '../client';

export interface CaseFolder {
  id: string;
  folderName: string;
  folderType: string;
  folderPath: string;
  folderOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Case {
  id: string;
  type: string;
  status: string;
  quantity: number;
  numberOfTransfers: number;
  ess: boolean;
  essPartial: boolean;
  stocks: string | null;
  shares: string | null;
  numberOfStocksAndShares: number | null;
  numberOfCashISA: number | null;
  carryForward: string | null;
  singleType: string | null;
  regularType: string | null;
  transferProviders: string | null;
  stocksAndSharesProviders: string | null;
  cashISAProviders: string | null;
  isaNewMoneyTransfers: string | null;
  cfr: string | null;
  ceding: string | null;
  cyc: string | null;
  illustration: string | null;
  sl: string | null;
  createdAt: string;
  updatedAt: string;
  folders: CaseFolder[];
}

export interface CreateCaseRequest {
  type: string;
  numberOfTransfers: number;
  ess?: boolean;
  essPartial?: boolean;
  transferProviders?: string[];
  cfr?: string;
  ceding?: string;
  cyc?: string;
  illustration?: string;
  sl?: string;
}

export interface GetClientCasesResponse {
  status: boolean;
  message: string;
  data: Case[];
}

export interface CreateCaseResponse {
  status: boolean;
  message: string;
  data: Case;
}

export interface DeleteCaseResponse {
  status: boolean;
  message: string;
  data: {
    message: string;
    caseId: string;
    clientId: string;
  };
}

export async function getClientCases(clientId: string): Promise<GetClientCasesResponse> {
  return apiFetch<GetClientCasesResponse>(`/clients/${clientId}/cases`);
}

export async function createCase(clientId: string, data: CreateCaseRequest): Promise<CreateCaseResponse> {
  return apiFetch<CreateCaseResponse>(`/clients/${clientId}/cases`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteCase(clientId: string, caseId: string): Promise<DeleteCaseResponse> {
  return apiFetch<DeleteCaseResponse>(`/clients/${clientId}/cases/${caseId}`, {
    method: 'DELETE',
  });
} 