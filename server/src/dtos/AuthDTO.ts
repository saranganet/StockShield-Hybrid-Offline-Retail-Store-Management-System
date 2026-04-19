import { Role } from "@prisma/client";

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginDTO {
  email: string;
  password: string;
}
