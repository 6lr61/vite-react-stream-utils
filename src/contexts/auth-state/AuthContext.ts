import { createContext } from "react";

export interface AuthState {
  client: {
    id: string;
  };
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

export const AuthContext = createContext<Value>(
  new Proxy({} as Value, {
    get() {
      throw new Error("AuthContext must be provided");
    },
  })
);
