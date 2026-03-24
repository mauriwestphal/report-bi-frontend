import { Layout as AntdLayout } from "antd";
import React, { CSSProperties, useEffect, useState } from "react";
import Content from "./Content";
import Header from "./Header";

import { LayoutStyled } from "./style";
import { useRouter } from "next/router";
import { isTokenValid } from "../../utils/token";
import { getToken } from "../../utils/auth";
import HeaderDashboard from "./Header-Dashboard";

type ValidacionTitle = {
  undefined: boolean,
  true: boolean,
  false: boolean
}
const Layout = ({
  children,
  style,
  title 
}: {
  children: React.ReactNode;
  style?: CSSProperties;
  title?: any
}) => {
  const router = useRouter();
  const activeTitle: any  = {
    undefined: true,
    true: true, 
    false: false
  }

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MOCK_AUTH === 'true') return;
    const token = getToken();
    if (token && !isTokenValid(token)) {
      router.push({ pathname: "/auth", query: { expired: true } });
    }
  }, []);

  const validateHeader = (active:string) => {
    if(activeTitle[active]){
      return router.pathname === "/dashboard" ? <HeaderDashboard /> : <Header />;
    } else {
      return 
    }
  };
  return (
    <LayoutStyled>
      <AntdLayout
        className={router.pathname === "/home" ? "layout-home" : "layout"}
      >
        {validateHeader(title)}
        <Content style={style}>{children}</Content>
      </AntdLayout>
    </LayoutStyled>
  );
};

export default Layout;
