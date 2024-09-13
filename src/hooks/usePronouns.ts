import { useEffect, useMemo, useState } from "react";

const PRONOUNS_URL = "https://api.pronouns.alejo.io/v1";

interface PronounDescription {
  name: string;
  subject: string;
  object: string;
  singular: boolean;
}

interface UserEntry {
  channel_id: string;
  channel_login: string;
  pronoun_id: string;
  alt_pronoun_id: null; // unused?
}

type PronounResponse = Record<PronounDescription["name"], PronounDescription>;

async function getPronouns(): Promise<PronounResponse> {
  const response = await fetch(`${PRONOUNS_URL}/pronouns`);

  if (!response.ok) {
    throw new Error(
      `getUser: Bad HTTP response: ${response.status.toString()} ${
        response.statusText
      }`
    );
  }

  return (await response.json()) as PronounResponse;
}

async function getUser(login: string): Promise<UserEntry | null> {
  const response = await fetch(`${PRONOUNS_URL}/users/${login}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `getUser: Bad HTTP response: ${response.status.toString()} ${
        response.statusText
      }`
    );
  }

  return (await response.json()) as UserEntry;
}

function toString(description: PronounDescription): string {
  return description.singular
    ? description.subject
    : `${description.subject}/${description.object}`;
}

const descriptors = new Map<string, PronounDescription>();
const users = new Map<string, UserEntry | null>();

// FIXME DON'T DO THIS!
(function init() {
  if (descriptors.size > 0) {
    return;
  }

  getPronouns()
    .then((pronouns) => {
      Object.entries(pronouns).forEach(([pronoun, description]) =>
        descriptors.set(pronoun, description)
      );
    })
    .catch((error: unknown) => {
      console.error("PronounProvider:", error);
    });
})();

export function usePronouns(login: string): string | undefined {
  const [pronoun, setPronoun] = useState<PronounDescription>();
  const user = useMemo(() => users.get(login), [login]);

  if (user) {
    setPronoun(() => descriptors.get(user.pronoun_id));
  }

  useEffect(() => {
    if (user || user === null) {
      return;
    }

    void getUser(login).then((entry) => {
      if (entry === null) {
        users.set(login, null);
        return;
      }

      setPronoun(() => descriptors.get(entry.pronoun_id));
    });
  }, [login, user]);

  return pronoun && toString(pronoun);
}
