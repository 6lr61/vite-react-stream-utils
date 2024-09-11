import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { validateToken } from "../../utils/validateToken";
import type { OAuthMessage } from "../../callback";
import { revokeToken } from "../../utils/revokeToken";
import { type AuthState, AuthStateContext } from "./AuthStateContext";

const OAUTH2_URL = "https://id.twitch.tv/oauth2/authorize";

export default function AuthStateProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [accessToken, setAccessToken] = useLocalStorage("accessToken");
  const [authState, setAuthState] = useState<AuthState>();

  const login = useCallback(() => {
    const url = new URL(OAUTH2_URL);
    url.searchParams.set("client_id", import.meta.env.VITE_CLIENT_ID);
    url.searchParams.set("redirect_uri", import.meta.env.VITE_REDIRECT_URI);
    url.searchParams.set("scope", ["user:read:chat"].join(" "));
    url.searchParams.set("response_type", "token");
    url.searchParams.set("force_verify", "true");

    void window.open(
      url,
      undefined,
      "popup=yes,innerWidth=480,innerHeight=784"
    );
  }, []);

  const handleMessage = useCallback(
    (event: MessageEvent<OAuthMessage>) => {
      const message = event.data;

      if (message.type === "token") {
        setAccessToken(message.data.token);
      } else {
        console.error("handleMessage:", message.data);
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
      .then((data) => {
        if (discard) {
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
      })
      .catch((error: unknown) => {
        console.error("validateToken:", error);
      });

    return () => {
      discard = true;
    };
  }, [accessToken, setAccessToken]);

  const value = { login, signOut, authState };

  return (
    <AuthStateContext.Provider value={value}>
      {children}
    </AuthStateContext.Provider>
  );
}
