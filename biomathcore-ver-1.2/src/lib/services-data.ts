// src/lib/services-data.ts

export type CategoryKey =
  | "critical-health"
  | "everyday-wellness"
  | "longevity-anti-aging"
  | "mental-wellness"
  | "fitness-performance"
  | "womens-health"
  | "mens-health"
  | "beauty-skincare"
  | "nutrition-diet"
  | "sleep-recovery"
  | "environmental-health"
  | "family-health"
  | "preventive-medicine-longevity"
  | "biohacking-performance"
  | "senior-care"
  | "eye-health-suite"
  | "general-sexual-longevity"
  | "mens-sexual-health"
  | "womens-sexual-health"
  | "digital-therapeutics-store";

export interface Category {
  key: CategoryKey;
  title: string;
}

export interface ServiceItem {
  slug: string; // URL slug: /services/<slug>
  title: string; // Display name
  emoji?: string; // Optional icon
  shortDescription: string; // Shown on cards
  longDescription: string; // Shown on detail page
  category: CategoryKey; // Category mapping
  plan?: "Free" | "Pro" | "Enterprise";
}

export const CATEGORIES: Category[] = [
  { key: "critical-health", title: "Critical Health" },
  { key: "everyday-wellness", title: "Everyday Wellness" },
  { key: "longevity-anti-aging", title: "Longevity & Anti-Aging & Anti‑Aging" },
  { key: "mental-wellness", title: "Mental Wellness" },
  { key: "fitness-performance", title: "Fitness & Performance" },
  { key: "womens-health", title: "Women's Health" },
  { key: "mens-health", title: "Men's Health" },
  { key: "beauty-skincare", title: "Beauty & Skincare & Skincare" },
  { key: "nutrition-diet", title: "Nutrition & Diet & Diet" },
  { key: "sleep-recovery", title: "Sleep & Recovery & Recovery" },
  { key: "environmental-health", title: "Environmental Health Health" },
  { key: "family-health", title: "Family Health" },
  {
    key: "preventive-medicine-longevity",
    title: "Preventive Medicine & Longevity",
  },
  { key: "biohacking-performance", title: "Biohacking & Performance" },
  { key: "senior-care", title: "Senior Care" },
  { key: "eye-health-suite", title: "Eye‑Health Suite" },
  { key: "general-sexual-longevity", title: "General Sexual Longevity & Anti-Aging" },
  { key: "mens-sexual-health", title: "Men's General Sexual Longevity & Anti-Aging" },
  { key: "womens-sexual-health", title: "Women's General Sexual Longevity & Anti-Aging" },
  { key: "digital-therapeutics-store", title: "Digital Therapeutics Store" },
];

export function getCategoryTitle(key: CategoryKey): string {
  return CATEGORIES.find((c) => c.key === key)?.title ?? "Services";
}

export const SERVICES: ServiceItem[] = [
  {
    slug: "mood-tracker",
    title: "Mood Tracker",
    emoji: "📈",
    shortDescription:
      "Daily emotional logging with AI pattern recognition. Understand mood cycles and triggers.",
    longDescription:
      "Track your daily emotions with lightweight logging. Our AI highlights recurring patterns, \
correlates them with sleep and lifestyle inputs, and produces clear, actionable guidance aimed at оздоровление \
и устойчивость к стрессу. Поддерживает экспорт отчётов.",
    category: "mental-wellness",
    plan: "Free",
  },
  {
    slug: "cognitive-assessment",
    title: "Cognitive Assessment",
    emoji: "🧠",
    shortDescription:
      "AI‑driven memory, attention, and processing‑speed checks to track cognitive performance.",
    longDescription:
      "Короткие валидированные упражнения позволяют оценивать внимание, рабочую память и скорость обработки \
информации. Результаты сравниваются с персональной базовой линией и помогают наблюдать прогресс без медицинских обещаний.",
    category: "mental-wellness",
    plan: "Free",
  },
  {
    slug: "sleep-mood-link",
    title: "Sleep & Recovery‑Mood Link",
    emoji: "🌙",
    shortDescription:
      "Analyzes how sleep quality and timing influence your mood trends.",
    longDescription:
      "Импортируйте данные сна из трекеров или вводите вручную. Алгоритм сопоставляет фазы сна и время засыпания \
с изменениями в самоощущении и подсказывает мягкие корректировки режима для лучшего самочувствия.",
    category: "sleep-recovery",
    plan: "Free",
  },
  {
    slug: "stress-coach",
    title: "Stress Coach",
    emoji: "🌿",
    shortDescription:
      "Personalized stress‑reduction playbooks based on your patterns.",
    longDescription:
      "Анализ привычных триггеров и контекста. Получайте короткие, практичные протоколы дыхания, \
микро‑паузы и поведенческие приёмы для снижения стресса в течение дня.",
    category: "mental-wellness",
    plan: "Free",
  },
  {
    slug: "focus-enhancer",
    title: "Focus Enhancer",
    emoji: "💡",
    shortDescription:
      "Boosts concentration with evidence‑informed micro‑exercises.",
    longDescription:
      "Персональные микро‑интервалы, напоминания и когнитивные практики для поддержания фокусировки. \
Подстраивается под ваш рабочий график и энерго‑профиль.",
    category: "fitness-performance",
    plan: "Free",
  },
  {
    slug: "risk-insight",
    title: "Risk Insight",
    emoji: "🧭",
    shortDescription:
      "Transforms checkup/lab data into clear wellness insights and next steps.",
    longDescription:
      "Загружайте результаты базовых анализов — система аккуратно объясняет показатели простыми словами, \
подсвечивает области внимания и предлагает вопросы для обсуждения с врачом.",
    category: "preventive-medicine-longevity",
    plan: "Pro",
  },
  {
    slug: "biological-age-factors",
    title: "Biological Age Factors",
    emoji: "⏳",
    shortDescription:
      "Lifestyle‑linked signals associated with biological aging trajectories.",
    longDescription:
      "Анализ поведенческих и физиологических индикаторов, связанных в исследованиях с траекториями старения. \
Результат — образовательный отчёт с приоритетами для привычек и режима.",
    category: "longevity-anti-aging",
    plan: "Pro",
  },
  {
    slug: "smart-food-swaps",
    title: "Smart Food Swaps",
    emoji: "🥗",
    shortDescription:
      "Simple nutrition swaps matched to your preferences and goals.",
    longDescription:
      "Не диета и не жёсткие ограничения. Это небольшой список разумных замен с эквивалентной калорийностью, \
улучшающих пищевой профиль и поддерживающих оздоровление.",
    category: "nutrition-diet",
    plan: "Free",
  },
  {
    slug: "healthy-travel-kit",
    title: "Healthy Travel Kit",
    emoji: "🧳",
    shortDescription:
      "Jet‑lag‑aware sleep, hydration, and movement plan for trips.",
    longDescription:
      "Перед поездкой укажите перелёты и часовые пояса — получите компактный план по сну, свету, воде и движению \
для снижения усталости и сохранения ритма.",
    category: "everyday-wellness",
    plan: "Free",
  },
  {
    slug: "skin-health-routine",
    title: "Skin Health Routine",
    emoji: "✨",
    shortDescription: "Minimal, effective skincare routine builder.",
    longDescription:
      "На основе типа кожи и среды формируется краткий распорядок без перегруза средствами: базовая чистка, защита, \
восстановление. С акцентом на устойчивость и разумную частоту.",
    category: "beauty-skincare",
    plan: "Free",
  },
  {
    slug: "women-cycle-balance",
    title: "Women’s Cycle Balance",
    emoji: "🧬",
    shortDescription: "Cycle‑aware lifestyle tips and gentle planning aids.",
    longDescription:
      "Ненавязчивые подсказки по режиму, сну и тренировкам, учитывающие фазы цикла. Образовательный контент и \
личные заметки для обсуждения с врачом при необходимости.",
    category: "womens-health",
    plan: "Free",
  },
  {
    slug: "mens-vitality-basics",
    title: "Men’s Vitality Basics",
    emoji: "🏃‍♂️",
    shortDescription:
      "Core habits to support energy, sleep, and body composition.",
    longDescription:
      "Фундированные привычки: движение, сон, питание, свет. Никаких громких обещаний — только последовательные шаги, \
которые поддерживают самочувствие.",
    category: "mens-health",
    plan: "Free",
  },
  {
    slug: "environment-exposure-check",
    title: "Environment Exposure Check",
    emoji: "🌍",
    shortDescription:
      "Ambient air, noise, and light hygiene tips for your context.",
    longDescription:
      "Оценивает средовые факторы (шум, свет, воздух) и подсказывает простые изменения окружающей среды для повышения \
комфортности и качества сна.",
    category: "environmental-health",
    plan: "Free",
  },
  {
    slug: "family-wellness-hub",
    title: "Family Wellness Hub",
    emoji: "👨‍👩‍👧‍👦",
    shortDescription:
      "Lightweight family routines for sleep, meals, and activity.",
    longDescription:
      "Совместные распорядки и мягкие правила: семейные приёмы пищи, вечерние ритуалы сна, активные прогулки. \
Инструменты для позитивной динамики без давления.",
    category: "family-health",
    plan: "Free",
  },
  {
    slug: "active-aging-playbook",
    title: "Active Aging Playbook",
    emoji: "🧓",
    shortDescription: "Joint‑friendly movement, balance and recovery pointers.",
    longDescription:
      "Подборка щадящих активностей, тренировка баланса, рекомендации по восстановлению — всё в формате, \
который удобно внедрять постепенно.",
    category: "senior-care",
    plan: "Free",
  },
  {
    slug: "eye-comfort-daily",
    title: "Eye Comfort Daily",
    emoji: "👁️",
    shortDescription: "Screen‑time aware breaks and lighting hygiene.",
    longDescription:
      "Протокол «20‑20‑20», настройки освещения и экрана, напоминания о микропаузах. Подходит для длительной работы за дисплеями.",
    category: "eye-health-suite",
    plan: "Free",
  },
  {
    slug: "sexual‑longevity-fundamentals",
    title: "Sexual Longevity & Anti-Aging Fundamentals",
    emoji: "💞",
    shortDescription:
      "Evidence‑informed lifestyle factors supporting sexual longevity.",
    longDescription:
      "Деликатный образовательный модуль по факторам образа жизни, которые в исследованиях ассоциируются \
с сексуальным долголетием.",
    category: "general-sexual-longevity",
    plan: "Pro",
  },
  {
    slug: "mens-sexual-health-guide",
    title: "Men’s General Sexual Longevity & Anti-Aging Guide",
    emoji: "♂️",
    shortDescription:
      "Plain‑language guide and trackers for men’s sexual health.",
    longDescription:
      "Простой язык, приватные трекеры и подсказки для обсуждения с врачом. Никаких диагнозов — только ясный контент и самонаблюдение.",
    category: "mens-sexual-health",
    plan: "Pro",
  },
  {
    slug: "womens-sexual-health-guide",
    title: "Women’s General Sexual Longevity & Anti-Aging Guide",
    emoji: "♀️",
    shortDescription:
      "Education and gentle routines for women’s sexual health.",
    longDescription:
      "Образовательные материалы и заботливые распорядки, поддерживающие комфорт и уверенность. \
Материал сформулирован бережно и без стигмы.",
    category: "womens-sexual-health",
    plan: "Pro",
  },
  {
    slug: "digital-therapeutics-catalog",
    title: "Digital Therapeutics Catalog",
    emoji: "💊",
    shortDescription:
      "Curated list of vetted digital therapeutics apps and tools.",
    longDescription:
      "Каталог проверенных цифровых решений (DTx) с краткими обзорами и ссылками. Мы не назначаем лечение — \
мы помогаем сориентироваться в инструментах.",
    category: "digital-therapeutics-store",
    plan: "Free",
  },
];


export function findServiceBySlug(slug: string): ServiceItem | null {
  const s = SERVICES.find((s) => s.slug === slug);
  return s ?? null;
}

export function getServicesByCategory(category: CategoryKey): ServiceItem[] {
  return SERVICES.filter((s) => s.category === category);
}
