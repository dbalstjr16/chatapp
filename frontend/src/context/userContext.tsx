import { createContext } from "react";

export type UserContextType = [
  string,
  React.Dispatch<React.SetStateAction<string>>
];

const userContext = createContext<UserContextType | null>(null);

export default userContext;
