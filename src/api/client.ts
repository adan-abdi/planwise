export const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://planwise-backend-staging.up.railway.app';

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const error: Error & { response?: unknown } = new Error(data?.message || `API error: ${res.status}`);
    error.response = data;
    throw error;
  }
  return data;
}
