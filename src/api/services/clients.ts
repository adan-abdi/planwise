import { apiFetch } from '../client';

/// PLACEHOLDER
export async function getClients() {
  return apiFetch('/clients');
}
export async function getClientById(id: string) {
  return apiFetch(`/clients/${id}`);
}
export async function createClient(data: unknown) {
  return apiFetch('/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}