export interface User {
  id: string;
  userId?: string; // User ID for API calls
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string; // Full name
  phoneNumber?: string;
  roles: string[];
  role?: string;  // Single role (from backend login response)
  token?: string; // JWT token (from backend login response)
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  userId?: string; // User ID from backend
  email: string;
  firstName?: string;    // ✅ Add this
  lastName?: string;     // ✅ Add this
  fullName?: string;     // ✅ Add this
  phoneNumber?: string; // ✅ Add this
  role?: string;         // ✅ Add this (singular from backend)
  roles?: string[];      // Keep this (array format)
}