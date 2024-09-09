import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  AuthError,
  type AuthState,
  AuthStateContext,
} from "./AuthStateContext";
import { useCallback, useEffect, useState } from "react";
import { validateToken } from "../utils/validateToken";
import { OAuthMessage } from "../callback";
import { revokeToken } from "../utils/revokeToken";

const OAUTH2_URL = "https://id.twitch.tv/oauth2/authorize";

function openLogin(
  scopes: string[],
  callback: (message: OAuthMessage) => void
): void {
  const url = new URL(OAUTH2_URL);
  url.searchParams.set("client_id", import.meta.env.VITE_CLIENT_ID);
  url.searchParams.set("redirect_uri", import.meta.env.VITE_REDIRECT_URI);
  url.searchParams.set("scope", scopes.join(" "));
  url.searchParams.set("response_type", "token");

  void window.open(url, undefined, "popup=yes");

  // FIXME: Clean up old listeners
  window.addEventListener("message", (event: MessageEvent<OAuthMessage>) => {
    callback(event.data);
  });
}

export default function AuthStateProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [accessToken, setAccessToken] = useLocalStorage("accessToken");
  const [error, setError] = useState<AuthError>();
  const [authState, setAuthState] = useState<AuthState>();

  const handleOAuthMessage = useCallback(
    (message: OAuthMessage) => {
      if (message.type === "token") {
        setAccessToken(message.data.token);
      } else {
        setError(message.data);
      }
    },
    [setAccessToken, setError]
  );

  const login = useCallback(() => {
    openLogin(["user:read:chat"], handleOAuthMessage);
  }, [handleOAuthMessage]);

  const signOut = useCallback(() => {
    if (accessToken) {
      setAccessToken(null);
      setAuthState(undefined);
      void revokeToken(accessToken);
    }
  }, [accessToken, setAccessToken]);

  useEffect(() => {
    if (accessToken) {
      let keep = true;

      console.log("validating token...");

      validateToken(accessToken)
        .then((data) => {
          if (keep) {
            setAuthState({
              clientId: data.client_id,
              user: {
                id: data.user_id,
                login: data.login,
              },
              token: {
                value: accessToken,
                expires: new Date(Date.now() + 1000 * data.expires_in),
                scopes: data.scopes,
              },
            });
          }
        })
        .catch((error: unknown) => {
          console.error("validateToken:", error);
        });

      return () => {
        keep = false;
      };
    } else {
      setAuthState(undefined);
    }
  }, [accessToken, setAccessToken]);

  const value = { login, signOut, authState, authError: error };

  return (
    <AuthStateContext.Provider value={value}>
      {children}
    </AuthStateContext.Provider>
  );
}
