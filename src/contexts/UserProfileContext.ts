import { createContext } from "react";
import type { UserData } from "../utils/api/getUser";

export const UserProfileContext = createContext<UserData | null>(null);
