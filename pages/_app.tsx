import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import "../styles/globals.css";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { LocaleProvider, Locale } from "../context/LocaleContext";
import { AppProvider } from "../context/AppContext";
import { Toaster } from "sonner";
import enMessages from "../messages/en.json";
import esMessages from "../messages/es.json";

function AppToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme as "light" | "dark"} richColors />;
}

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
    <NextIntlClientProvider locale={locale} messages={allMessages[locale]}>
      <LocaleProvider>
        <ThemeProvider>
          <AppProvider>
            <AppToaster />
            <Component {...pageProps} />
          </AppProvider>
        </ThemeProvider>
      </LocaleProvider>
    </NextIntlClientProvider>
  );
}
