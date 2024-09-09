import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { validateToken } from "../utils/validateToken";
import { OAuthMessage } from "../callback";
import { revokeToken } from "../utils/revokeToken";
import {
  AuthError,
  type AuthState,
  AuthStateContext,
} from "./AuthStateContext";

const OAUTH2_URL = "https://id.twitch.tv/oauth2/authorize";

export default function AuthStateProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [accessToken, setAccessToken] = useLocalStorage("accessToken");
  const [authError, setAuthError] = useState<AuthError>();
  const [authState, setAuthState] = useState<AuthState>();

  const login = useCallback(() => {
    const url = new URL(OAUTH2_URL);
    url.searchParams.set("client_id", import.meta.env.VITE_CLIENT_ID);
    url.searchParams.set("redirect_uri", import.meta.env.VITE_REDIRECT_URI);
    url.searchParams.set("scope", ["user:read:chat"].join(" "));
    url.searchParams.set("response_type", "token");

    void window.open(url, undefined, "popup=yes");
  }, []);

  const handleMessage = useCallback(
    (event: MessageEvent<OAuthMessage>) => {
      const message = event.data;

      if (message.type === "token") {
        setAccessToken(message.data.token);
      } else {
        setAuthError(message.data);
      }
    },
    [setAccessToken]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleMessage]);

  const signOut = useCallback(() => {
    if (accessToken) {
      setAccessToken(undefined);
      setAuthState(undefined);
      void revokeToken(accessToken);
    }
  }, [accessToken, setAccessToken]);

  useEffect(() => {
    if (!accessToken) {
      setAuthState(undefined);
      return;
    }

    let discard = false;

    validateToken(accessToken)
      .then(([data, error]) => {
        if (discard) {
          return;
        }

        if (error) {
          setAuthState(undefined);
          setAuthError({
            type: error.status.toString(),
            description: error.message,
          });

          return;
        }

        const token = {
          client: {
            id: data.client_id,
          },
          user: {
            id: data.user_id,
            login: data.login,
          },
          token: {
            value: accessToken,
            expires: new Date(Date.now() + 1000 * data.expires_in),
            scopes: data.scopes,
          },
        };

        setAuthState(token);
        setAuthError(undefined);
      })
      .catch((error: unknown) => {
        console.error("validateToken:", error);
      });

    return () => {
      discard = true;
    };
  }, [accessToken, setAccessToken]);

  const value = { login, signOut, authState, authError };

  return (
    <AuthStateContext.Provider value={value}>
      {children}
    </AuthStateContext.Provider>
  );
}
