import { apiFetch } from '../client';
import { baseUrl } from '../client';

export async function login(credentials: { email: string; password: string }) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}


export async function getProfile() {
  return apiFetch('/auth/profile');
}

export interface CheckUserExistsResponse {
  status: boolean;
  message: string;
  data: {
    exists: boolean;
    email: string;
  };
}

export async function checkUserExists(email: string): Promise<CheckUserExistsResponse> {
  return apiFetch('/auth/check-user-exists', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function requestSignupOtp(email: string) {
  return apiFetch('/auth/register/request-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function validateSignupOtp(email: string, otp: string) {
  console.log('validateSignupOtp called with:', { email, otp });
  try {
    const response = await apiFetch('/auth/register/validate-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    console.log('validateSignupOtp response:', response);
    return response;
  } catch (err) {
    console.error('validateSignupOtp error:', err);
    throw err;
  }
}

export interface RegisterResponse {
  status: boolean;
  message: string;
  data?: {
    token: string;
    refresh_token: string;
    user: {
      id: string;
      full_name: string | null;
      email: string;
    };
    organization: {
      id: string;
      name: string;
    };
  };
}

export async function registerUser(email: string, password: string): Promise<RegisterResponse> {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export interface UpdateProfileResponse {
  status: boolean;
  message: string;
  data?: {
    id: string;
    email: string;
    fullName: string;
    profilePictureUrl: string | null;
    organizations: unknown[];
  };
}

export async function updateUserProfile(fullName: string, profileImage?: File): Promise<UpdateProfileResponse> {
  const formData = new FormData();
  formData.append('fullName', fullName);
  if (profileImage) {
    formData.append('profileImage', profileImage);
  }
  const token = localStorage.getItem('token');
  const url = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const res = await fetch(`${url}/user/profile`, {
    method: 'PUT',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
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

// TODO: Call backend /logout endpoint here when available for token/session invalidation
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('organization');
  window.location.href = '/';
}