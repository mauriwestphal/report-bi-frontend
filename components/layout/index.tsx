import React, { CSSProperties, useEffect } from "react";
import { useRouter } from "next/router";
import { isTokenValid } from "../../utils/token";
import { getToken } from "../../utils/auth";
import Header from "./Header";
import HeaderDashboard from "./Header-Dashboard";

const activeHeaderMap: Record<string, boolean> = {
  undefined: true,
  true: true,
  false: false,
};

const Layout = ({
  children,
  style,
  title,
}: {
  children: React.ReactNode;
  style?: CSSProperties;
  title?: any;
}) => {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") return;
    const token = getToken();
    if (token && !isTokenValid(token)) {
      router.push({ pathname: "/auth", query: { expired: true } });
    }
  }, []);

  const renderHeader = () => {
    if (!activeHeaderMap[String(title)]) return null;
    return router.pathname === "/dashboard" ? <HeaderDashboard /> : <Header />;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {renderHeader()}
      <main className="px-6 py-6" style={style}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
