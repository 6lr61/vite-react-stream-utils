import { useQuery } from "@tanstack/react-query";

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

const cachedPronouns = getPronouns();

async function getPronouns(): Promise<PronounResponse> {
  const response = await fetch(`${PRONOUNS_URL}/pronouns`);
  return (await response.json()) as PronounResponse;
}

async function getUser(login: string): Promise<UserEntry | null> {
  try {
    const response = await fetch(`${PRONOUNS_URL}/users/${login}`);
    return (await response.json()) as UserEntry;
  } catch {
    return null;
  }
}

async function getUserPronoun(login: string): Promise<string | null> {
  const pronouns = await cachedPronouns;
  const user = await getUser(login);
  const userPronoun = user && pronouns[user.pronoun_id];
  return userPronoun ? toString(userPronoun) : null;
}

function toString(description: PronounDescription): string {
  return description.singular
    ? description.subject
    : `${description.subject}/${description.object}`;
}

export function usePronouns(login: string) {
  return useQuery({
    queryKey: ["userPronoun", login],
    queryFn: () => getUserPronoun(login),
  });
}
