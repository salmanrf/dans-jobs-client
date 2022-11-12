import React from "react";
import { User } from "../models/user.model";

export const UserContext = React.createContext<{
  user: User | null;
  is_authorized: boolean;
  set_token(token: string): void;
}>({
  user: null,
  is_authorized: false,
  set_token: () => null,
});
