// src/context/auth-context.ts
import { createContext } from "react";
import type { User } from "firebase/auth";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  loginEmail: (email: string, password: string) => Promise<void>;
  registerEmail: (email: string, password: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  // dummy no-op implementations just to satisfy the type at init
  loginEmail: async () => {},
  registerEmail: async () => {},
  loginGoogle: async () => {},
  logout: async () => {},
});
