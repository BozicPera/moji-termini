// Auth types
export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'staff';
  clinic_id: number;
  is_active: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// API Response types
export interface ApiError {
  detail: string | Array<{ msg: string; type: string }>;
}
