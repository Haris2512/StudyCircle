export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  semester?: number;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ path: string; message: string }>;
}
