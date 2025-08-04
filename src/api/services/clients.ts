import { apiFetch } from '../client';

export interface CreateClientRequest {
  name: string;
  partnerId: string;
}

export interface UpdateClientRequest {
  personalDetails: {
    fullName: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    retirementAge?: number;
    attitudeToRisk?: string;
  };
  professionalDetails?: {
    partner?: {
      fullName?: string;
      email?: string;
    };
  };
}

export interface Client {
  id: string;
  reference: string;
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  dateOfBirth: string | null;
  retirementAge: number | null;
  attitudeToRisk: string | null;
  caseTypes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientResponse {
  status: boolean;
  message: string;
  data: Client;
}

export interface UpdateClientResponse {
  status: boolean;
  message: string;
  data: Client;
}

export interface GetClientsResponse {
  status: boolean;
  message: string;
  data: Client[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export async function getClients(page: number = 1, perPage: number = 10): Promise<GetClientsResponse> {
  return apiFetch<GetClientsResponse>(`/clients?per_page=${perPage}&page=${page}`);
}

export async function getClientById(id: string) {
  return apiFetch(`/clients/${id}`);
}

export async function createClient(data: CreateClientRequest): Promise<CreateClientResponse> {
  return apiFetch<CreateClientResponse>('/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateClient(clientId: string, data: UpdateClientRequest): Promise<UpdateClientResponse> {
  return apiFetch<UpdateClientResponse>(`/clients/${clientId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}