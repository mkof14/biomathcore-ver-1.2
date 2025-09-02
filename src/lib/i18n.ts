import en from "@/i18n/forms/en/forms.json";
import es from "@/i18n/forms/es/forms.json";
import ru from "@/i18n/forms/ru/forms.json";

type Dict = typeof en;

const MAP: Record<string, Dict> = { en, es, ru };

export function normalizeLang(input?: string): "en"|"es"|"ru" {
  const v = (input||"").toLowerCase();
  if (v.startsWith("es")) return "es";
  if (v.startsWith("ru")) return "ru";
  return "en";
}

export function localizeForm(form: any, slug: string, lang: string) {
  const L = MAP[normalizeLang(lang)]?.[slug];
  if (!L) return form;

  const clone = structuredClone(form);

  // Заголовок
  if (L.title) clone.title = L.title;

  // Заголовки секций по title
  if (L.sections && Array.isArray(clone.sections)) {
    clone.sections = clone.sections.map((s: any) => {
      const nt = L.sections[s.title] || s.title;
      return { ...s, title: nt };
    });
  }

  // Вопросы: если заданы ключи (например, question.key), можно маппить по key.
  // Если ключей нет — оставляем как есть. Для примера маппим базовые по умолчанию (без key).
  // Здесь демонстрационно ничего не меняем в label (кроме будущей поддержки key).
  return clone;
}
