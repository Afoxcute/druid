import React, { createContext, useContext, useState, useEffect } from "react";
import { languages, translations, Language } from "@/lib/languages";

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages.en);

  useEffect(() => {
    // Get language from localStorage or browser preference
    const savedLanguage = localStorage.getItem("language");
    const browserLanguage = navigator.language.split("-")[0];
    const initialLanguage = savedLanguage || browserLanguage || "en";

    if (languages[initialLanguage]) {
      setCurrentLanguage(languages[initialLanguage]);
    }
  }, []);

  const setLanguage = (code: string) => {
    if (languages[code]) {
      setCurrentLanguage(languages[code]);
      localStorage.setItem("language", code);
      document.documentElement.lang = code;
      document.documentElement.dir = languages[code].direction;
    }
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[currentLanguage.code];

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key;
      }
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        availableLanguages: Object.values(languages),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
} 