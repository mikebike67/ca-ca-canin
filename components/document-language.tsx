"use client";

import { useEffect } from "react";

type DocumentLanguageProps = {
  lang: string;
};

export default function DocumentLanguage({ lang }: DocumentLanguageProps) {
  useEffect(() => {
    const root = document.documentElement;
    const previousLang = root.lang;

    root.lang = lang;

    return () => {
      root.lang = previousLang;
    };
  }, [lang]);

  return null;
}
