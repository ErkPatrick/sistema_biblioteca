export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: "bibliotecario" | "admin";
}

export interface CreateUsuarioDTO {
  nome: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: "bibliotecario" | "admin";
}

export interface UpdateUsuarioDTO {
  nome?: string;
  email?: string;
  role?: "bibliotecario" | "admin";
}


