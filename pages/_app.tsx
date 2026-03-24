import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { ConfigProvider } from "antd";
import { NextIntlClientProvider } from "next-intl";
import "antd/dist/reset.css";
import "../styles/globals.css";
import "../styles/style.scss";
import "../styles/pages/auth/style.scss";
import ThemeProviderComponent from "../components/ThemeProviderComponent";
import { ThemeProvider } from "../context/ThemeContext";
import { LocaleProvider, Locale } from "../context/LocaleContext";
import enMessages from "../messages/en.json";
import esMessages from "../messages/es.json";

const allMessages: Record<Locale, typeof enMessages> = {
  en: enMessages,
  es: esMessages,
};

export default function App({ Component, pageProps }: AppProps) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem("bipro-locale") as Locale;
    if (stored === "en" || stored === "es") setLocale(stored);
  }, []);

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
      <NextIntlClientProvider locale={locale} messages={allMessages[locale]}>
        <LocaleProvider>
          <ThemeProvider>
            <ThemeProviderComponent Component={Component} pageProps={pageProps} />
          </ThemeProvider>
        </LocaleProvider>
      </NextIntlClientProvider>
    </ConfigProvider>
  );
}
