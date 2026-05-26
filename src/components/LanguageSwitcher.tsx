import React from "react";
import { Globe } from "lucide-react";

export type LanguageCode = "en" | "yo" | "ha" | "ig";

interface LanguageSwitcherProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const languages: { code: LanguageCode; label: string; native: string; flag: string }[] = [
    { code: "en", label: "English", native: "English", flag: "🇳🇬" },
    { code: "yo", label: "Yoruba", native: "Yorùbá", flag: "🇳🇬" },
    { code: "ha", label: "Hausa", native: "Harshen Hausa", flag: "🇳🇬" },
    { code: "ig", label: "Igbo", native: "Asụsụ Igbo", flag: "🇳🇬" },
  ];

  return (
    <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-lg p-1">
      <Globe className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
      <div className="flex items-center gap-1.5">
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => onLanguageChange(lang.code)}
            title={`${lang.label} (${lang.native})`}
            className={`px-2 py-1 text-[10px] font-mono tracking-wider uppercase rounded font-bold transition-all ${
              currentLanguage === lang.code
                ? "bg-orange-500/20 border border-orange-500/30 text-orange-400"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            {lang.code}
          </button>
        ))}
      </div>
    </div>
  );
}
