"use client";
import React, {createContext, useContext, useMemo, useState} from "react";

type Lang = "en"|"ru"|"es"|"fr"|"de"|"zh";
type Ctx = { lang:Lang; setLang:(l:Lang)=>void; tUI:(k:string)=>string; translateLabel:(k:string)=>string; };
const I18nCtx = createContext<Ctx|null>(null);

const UI_DICT: Record<string, Partial<Record<Lang,string>>> = {
  "Back":{en:"Back",ru:"Назад"}, "Patient Forms":{en:"Patient Forms",ru:"Анкеты пациентов"},
  "Save draft":{en:"Save draft",ru:"Сохранить черновик"}, "Submit":{en:"Submit",ru:"Отправить"},
  "Complete required":{en:"Complete required",ru:"Заполните обязательные"},
};
const LABEL_MAP: Record<string, Partial<Record<Lang,string>>> = {};

export function I18nProvider({children}:{children:React.ReactNode}){
  const [lang,setLang] = useState<Lang>("en");
  const tUI = (k:string)=> (UI_DICT[k]?.[lang] ?? UI_DICT[k]?.en ?? k);
  const translateLabel = (k:string)=> (LABEL_MAP[k]?.[lang] ?? k);
  const value = useMemo(()=>({lang,setLang,tUI,translateLabel}),[lang]);
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}
export function useI18n(){
  const v = useContext(I18nCtx);
  if(!v) throw new Error("useI18n must be used inside <I18nProvider>");
  return v;
}

/** Небольшой селектор языков (как в number inputs — с раскрывающимся списком) */
export function LanguageSelect(){
  const {lang,setLang} = useI18n();
  return (
    <select
      value={lang}
      onChange={e=>setLang(e.target.value as any)}
      className="h-9 rounded-md border border-neutral-700 bg-neutral-900 text-white px-2"
      aria-label="Language"
    >
      <option value="en">English</option>
      <option value="ru">Русский</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
      <option value="zh">中文</option>
    </select>
  );
}
