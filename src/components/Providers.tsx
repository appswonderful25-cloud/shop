"use client";

import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { LanguageProvider } from "@/app/store/LanguageContext";
import { Toaster } from "react-hot-toast";
import { ReactNode, useEffect, useState } from "react";

export default function Providers({ children, token }: { children: ReactNode; token: string }) {
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const locale = localStorage.getItem("store_locale") || "en";
    setLang(locale);
    setDir(locale === "ar" ? "rtl" : "ltr");
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";

    const handler = () => {
      const l = localStorage.getItem("store_locale") || "en";
      setLang(l);
      setDir(l === "ar" ? "rtl" : "ltr");
      document.documentElement.lang = l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    };
    window.addEventListener("locale-changed", handler);
    return () => window.removeEventListener("locale-changed", handler);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider initialLocale={lang as "en" | "ar"}>
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}
