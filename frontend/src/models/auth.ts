export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  usuario: Usuario;  //posso acessar o senha_provisoria pelo usuario
  token: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  message: string;
  usuario: Usuario;
}

export interface UpdatePasswordRequest {
  password: string;
  password_confirmation: string;
}

export interface UpdatePasswordResponse {
  message: string;
  usuario: Usuario;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha_provisoria: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}
