import { apiFetch } from '../client';

export interface Partner {
  id: string;
  createdAt: string;
  updatedAt: string;
  deleted_at: string | null;
  name: string;
  email: string;
  reference: string;
  organizationId: string;
}

export interface PartnersResponse {
  status: boolean;
  message: string;
  data: Partner[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export async function getPartners(page: number = 1, perPage: number = 10): Promise<PartnersResponse> {
  return apiFetch<PartnersResponse>(`/partners?per_page=${perPage}&page=${page}`);
} 