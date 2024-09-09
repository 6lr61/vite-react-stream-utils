// The token is now a URL fragment
const rootElement = document.querySelector("#root");

if (!(rootElement instanceof HTMLDivElement)) {
  throw new Error("Couldn't find the root element for the React App");
}

export type OAuthMessage = OAuthToken | OAuthError;

interface TwitchToken {
  access_token: string;
  scope: string;
  state: string;
  token_type: "bearer";
}

interface TwitchError {
  error: string;
  error_description: string;
  state: string;
}

interface OAuthToken {
  type: "token";
  state: string;
  data: {
    token: string;
    scopes: string[];
    type: "bearer";
  };
}

interface OAuthError {
  type: "error";
  state: string;
  data: { type: string; description: string };
}

function parseFragments(hash: string): OAuthToken {
  const fragments = Object.fromEntries(
    new URLSearchParams(hash.slice(1)).entries()
  ) as unknown as TwitchToken;

  return {
    type: "token",
    state: fragments.state,
    data: {
      token: fragments.access_token,
      scopes: fragments.scope.split(" "),
      type: fragments.token_type,
    },
  };
}

function parseParameters(search: string): OAuthError {
  const parameters = Object.fromEntries(
    new URLSearchParams(search).entries()
  ) as unknown as TwitchError;

  return {
    type: "error",
    state: parameters.state,
    data: {
      type: parameters.error,
      description: parameters.error_description,
    },
  };
}

if (!window.opener) {
  const errorElement = document.createElement("p");
  errorElement.textContent = "Has to be used inside a pop-up window";
  rootElement.append(errorElement);
}

if (window.location.hash) {
  // FIXME: Type this?
  window.opener.postMessage(parseFragments(window.location.hash));
}

if (window.location.search) {
  window.opener.postMessage(parseParameters(window.location.search));
}
