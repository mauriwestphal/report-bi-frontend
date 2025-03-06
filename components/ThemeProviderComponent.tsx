import { theme } from "antd";
import { NextComponentType, NextPageContext } from "next";
import { ThemeProvider } from "styled-components";
import { AppProvider } from "../context/AppContext";
const { useToken } = theme;
export default function ThemeProviderComponent({
  Component,
  pageProps,
}: {
  Component: NextComponentType<NextPageContext, any, any>;
  pageProps: any;
}) {
  const { token } = useToken();

  return (

    <ThemeProvider theme={token}>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </ThemeProvider>
  );
}
