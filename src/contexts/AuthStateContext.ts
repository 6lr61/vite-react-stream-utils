import { createContext } from "react";

export interface AuthState {
  clientId: string;
  user: {
    id: string;
    login: string;
  };
  token: {
    expires: Date;
    scopes: string[];
    value: string;
  };
}

export interface AuthError {
  type: string;
  description: string;
}

interface Value {
  authError?: AuthError;
  authState?: AuthState;
  login: () => void;
  signOut: () => void;
}

export const AuthStateContext = createContext<Value | null>(null);
