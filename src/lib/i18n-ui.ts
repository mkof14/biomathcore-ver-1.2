"use client";

// Поддерживаемые UI-языки
export type UILang = "en" | "ru" | "es";

const KEY = "ui_lang";

export function getLang(): UILang {
  if (typeof window === "undefined") return "en";
  const v = (localStorage.getItem(KEY) || "").toLowerCase();
  return (["en","ru","es"].includes(v) ? v : "en") as UILang;
}
export function setLang(v: UILang) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, v);
}

const M = {
  en: {
    "Patient Forms": "Patient Forms",
    "Open": "Open",
    "Back": "Back",
    "Submit": "Submit",
    "Loading…": "Loading…",
    "Complete required": "Complete required",
  },
  ru: {
    "Patient Forms": "Анкеты пациентов",
    "Open": "Открыть",
    "Back": "Назад",
    "Submit": "Отправить",
    "Loading…": "Загрузка…",
    "Complete required": "Заполните обязательные поля",
  },
  es: {
    "Patient Forms": "Formularios del paciente",
    "Open": "Abrir",
    "Back": "Atrás",
    "Submit": "Enviar",
    "Loading…": "Cargando…",
    "Complete required": "Complete los obligatorios",
  }
} as const;

export function tUI(key: keyof typeof M["en"], lang?: UILang): string {
  const l = lang ?? getLang();
  const dict = (M as any)[l] ?? M.en;
  return dict[key] ?? String(key);
}
