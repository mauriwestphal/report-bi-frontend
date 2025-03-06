import type { AppProps } from "next/app";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import "../styles/style.scss";
import "../styles/pages/auth/style.scss";
import ThemeProviderComponent from "../components/ThemeProviderComponent";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider
      theme={{
        hashed: false,
        token: {
          fontFamily: "Arial, Helvetica, sans-serif",
          colorTextDisabled: "#595959",
          colorPrimary: "#ff6600",
          colorTextBase: "#fff",
          colorText: "#fff",
          colorTextHeading: "#fff",
          colorTextSecondary: "#fff",
          colorBgLayout: "#1C1C1C",
          colorBgContainer: "#1C1C1C",
          colorPrimaryActive: "#ff6600",
          // colorBgCard: "#262626",
          colorPrimaryBg: "#1c1c1c",
          colorBgElevated: "#1C1C1C",
          colorPrimaryBorder: "#ff6600",

          borderRadius: 8,
        },
      }}
    >
      <ThemeProviderComponent Component={Component} pageProps={pageProps} />
    </ConfigProvider>
  );
}
