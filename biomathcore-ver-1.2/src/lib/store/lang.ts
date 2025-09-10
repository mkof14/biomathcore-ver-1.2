"use client";
import { create } from "zustand";

type Lang = "en"|"es"|"ru";
type State = {
  lang: Lang;
  setLang: (l: Lang)=>void;
};

const initial = ((): Lang => {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("lang");
  if (saved === "es" || saved === "ru" || saved === "en") return saved;
  return "en";
})();

export const useLang = create<State>((set) => ({
  lang: initial,
  setLang: (l) => {
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
    set({ lang: l });
  }
}));
