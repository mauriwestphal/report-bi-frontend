import { Spin } from "antd";
import { createContext, useContext, useEffect, useState } from "react";
import { UserInterface } from "../components/layout/interfaces";
import UserService from "../services/UserService/services";
import { PERMISSION_TYPE } from "../shared/enum/permission.enum";
import { getToken } from "../utils/auth";
import { isTokenValid } from "../utils/token";

interface IUserContext extends UserInterface {
  activePermissions: PERMISSION_TYPE[];
  activeReports: number[];
}

interface IContext {
  user?: IUserContext;
  getUser: ()=>void;
}

const Context = createContext<IContext>({} as IContext);

export function  useAppContext() {
  return useContext(Context);
}

export function AppProvider({ children }: any) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUserContext>();


  useEffect(() => {
    const token = getToken();

    if (token && isTokenValid(token)) {
      getUser();
    }
  }, []);

  const getUser = async () => {
    setLoading(true);
    try {
      const { data } = await UserService.getLoggerUser();
      if (data && data.role) {
        const activePermissions = data.role.permissions.map(
          (permission) => permission.keyName
        );

        const activeReports = data?.role?.reportPages ? data.role.reportPages.map(
          (reportPage) => reportPage.value
        ) : [];
        
        setUser({ ...data, activePermissions, activeReports });
      }
      setLoading(false);
    } catch (_) {
      setLoading(false);
    }
  };

  const value = {
    user,
    getUser
  };

  return (
    <Spin spinning={loading}>
      <Context.Provider value={value}>{children}</Context.Provider>
    </Spin>
  );
}
