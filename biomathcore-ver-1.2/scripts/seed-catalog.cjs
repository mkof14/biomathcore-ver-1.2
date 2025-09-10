const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const CATEGORIES = [
  { slug: "core-profile", title: "Core Profile" },
  { slug: "lifestyle", title: "Lifestyle & Daily" },
  { slug: "vitals", title: "Vitals" },
  { slug: "reports", title: "Reports" },
  { slug: "sexual-health", title: "Sexual Health" },
  { slug: "longevity", title: "Longevity" },
  { slug: "psychology", title: "Psychological Wellbeing" },
  { slug: "commercial", title: "Commercial" }
];

const SERVICES = [
  { slug: "patient-onboarding", title: "Patient Questionnaire (Onboarding)", category: "core-profile", visibility: "PUBLIC", requiredPlans: "" },
  { slug: "medical-history", title: "Medical History", category: "core-profile", visibility: "LOGGED_IN", requiredPlans: "" },
  { slug: "medications-allergies", title: "Medications & Allergies", category: "core-profile", visibility: "LOGGED_IN", requiredPlans: "" },
  { slug: "surgical-history", title: "Surgical & Hospitalization History", category: "core-profile", visibility: "LOGGED_IN", requiredPlans: "" },
  { slug: "family-history", title: "Family History", category: "core-profile", visibility: "LOGGED_IN", requiredPlans: "" },
  { slug: "lifestyle-habits", title: "Lifestyle & Habits", category: "lifestyle", visibility: "LOGGED_IN", requiredPlans: "" },
  { slug: "nutrition-profile", title: "Nutrition Profile", category: "lifestyle", visibility: "LOGGED_IN", requiredPlans: "" },
  { slug: "sleep-profile", title: "Sleep Profile", category: "lifestyle", visibility: "LOGGED_IN", requiredPlans: "" },
  { slug: "activity-fitness", title: "Activity & Fitness", category: "lifestyle", visibility: "LOGGED_IN", requiredPlans: "" },
  { slug: "vitals-self", title: "Vitals Self-Report", category: "vitals", visibility: "LOGGED_IN", requiredPlans: "" },
  { slug: "mental-health-stress", title: "Mental Health & Stress", category: "psychology", visibility: "PLAN_GATED", requiredPlans: "psychology" },

  { slug: "sexual-health-general", title: "Sexual Health – General", category: "sexual-health", visibility: "PLAN_GATED", requiredPlans: "sexual_health" },
  { slug: "sexual-health-men", title: "Sexual Health – Men", category: "sexual-health", visibility: "PLAN_GATED", requiredPlans: "sexual_health" },
  { slug: "sexual-health-women", title: "Sexual Health – Women", category: "sexual-health", visibility: "PLAN_GATED", requiredPlans: "sexual_health" },

  { slug: "longevity-core", title: "Longevity Core", category: "longevity", visibility: "PLAN_GATED", requiredPlans: "longevity" },

  { slug: "device-linking", title: "Device Linking & Data Sharing", category: "commercial", visibility: "PLAN_GATED", requiredPlans: "commercial" },
  { slug: "insurance-billing", title: "Insurance & Billing", category: "commercial", visibility: "PLAN_GATED", requiredPlans: "commercial" },
  { slug: "emergency-contacts", title: "Emergency Contacts", category: "core-profile", visibility: "LOGGED_IN", requiredPlans: "" },
  { slug: "communication-consent", title: "Communication & Consent", category: "core-profile", visibility: "PUBLIC", requiredPlans: "" }
];

async function main() {
  // idempotent: create or update Services only
  for (const s of SERVICES) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { title: s.title, description: s.description || null, category: s.category, visibility: s.visibility, requiredPlans: s.requiredPlans || "" },
      create: { slug: s.slug, title: s.title, description: s.description || null, category: s.category, visibility: s.visibility, requiredPlans: s.requiredPlans || "" }
    });
  }
  console.log("Seeded services:", SERVICES.length);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
