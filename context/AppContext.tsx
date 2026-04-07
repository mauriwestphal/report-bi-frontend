"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { UserInterface } from "../components/layout/interfaces";
import { PERMISSION_TYPE } from "../shared/enum/permission.enum";
import { getToken } from "../lib/auth";
import { isTokenValid } from "../utils/token";
import { MOCK_USER } from "../utils/mockUser";
import { apiFetch } from "../lib/api";

interface IUserContext extends UserInterface {
  activePermissions: PERMISSION_TYPE[];
  activeReports: number[];
}

interface IContext {
  user?: IUserContext;
  activeClientId?: number | null;
  setActiveClientId: (clientId: number | null) => void;
  clearActiveClientId: () => void;
  getUser: () => void;
  clearUser: () => void;
  isLoading: boolean;
}

export const AppContext = createContext<IContext>({} as IContext);
const Context = AppContext;

export function useAppContext() {
  return useContext(Context);
}

export function AppProvider({ children }: any) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUserContext>();
  const [activeClientId, setActiveClientIdState] = useState<number | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") {
      const activePermissions = MOCK_USER.role.permissions.map(
        (p) => p.keyName as PERMISSION_TYPE
      );
      setUser({ ...MOCK_USER, activePermissions, activeReports: [] });
      return;
    }

    const token = getToken();
    if (token && isTokenValid(token)) {
      getUser();
    }
  }, []);

  const getUser = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<UserInterface>('/auth/me');
      if (data && data.role) {
        const activePermissions = data.role.permissions.map(
          (permission) => permission.keyName
        );
        const activeReports = data?.role?.reportPages
          ? data.role.reportPages.map((reportPage) => reportPage.value)
          : [];
        setUser({ ...data, activePermissions, activeReports });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearUser = () => {
    setUser(undefined);
  };

  const setActiveClientId = (clientId: number | null) => {
    setActiveClientIdState(clientId);
  };

  const clearActiveClientId = () => {
    setActiveClientIdState(null);
  };

  const value = { 
    user, 
    activeClientId,
    setActiveClientId,
    clearActiveClientId,
    getUser, 
    clearUser, 
    isLoading: loading 
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
