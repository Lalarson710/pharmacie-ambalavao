export interface Role {
  id: number;
  nom: string;
  nom_affichage: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number | null;
  role: Role | null;
  permissions?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface LogoutResponse {
  message: string;
}