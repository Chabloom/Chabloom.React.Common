import React from "react";
import { UserManager } from "oidc-client";

export interface AppContextPropsBase {
  userManager: UserManager;
  userLoaded: boolean;
  userId: string;
  userName: string;
  userToken: string;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export const AppContextBase = React.createContext<AppContextPropsBase>({
  userManager: new UserManager({}),
  userLoaded: false,
  userId: "",
  userName: "",
  userToken: "",
  darkMode: false,
  setDarkMode: () => console.warn("setDarkMode not implemented"),
});

export const useAppContext = (): AppContextPropsBase => React.useContext(AppContextBase);
