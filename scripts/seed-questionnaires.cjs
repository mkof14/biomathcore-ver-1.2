const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const DATA = [
  // Core profile (required)
  { slug:"patient-onboarding", title:"Patient Questionnaire (Onboarding)", category:"Core Profile", visibility:"LOGGED_IN",
    description:"Personal info, contacts, language, preferences.",
    sections:[{ title:"Basics", order:1, questions:[
      { text:"Preferred language", questionType:"SINGLE_CHOICE", options: JSON.stringify(["English","Spanish","Other"]), order:1 },
      { text:"Primary phone", questionType:"TEXT", order:2 },
    ]}]},
  { slug:"medical-history", title:"Medical History", category:"Core Profile", visibility:"LOGGED_IN",
    description:"Conditions, diagnoses, onset date.",
    sections:[{ title:"History", order:1, questions:[
      { text:"Known conditions", questionType:"TEXTAREA", order:1 },
      { text:"Year of first diagnosis", questionType:"NUMBER", order:2 },
    ]}]},
  { slug:"medications-allergies", title:"Medications & Allergies", category:"Core Profile", visibility:"LOGGED_IN",
    description:"Medications (dose, frequency) and allergies.",
    sections:[{ title:"Current", order:1, questions:[
      { text:"List medications (dose, frequency)", questionType:"TEXTAREA", order:1 },
      { text:"Allergies (drugs, food, environment)", questionType:"TEXTAREA", order:2 },
    ]}]},
  { slug:"surgical-hospitalization", title:"Surgical & Hospitalization History", category:"Core Profile", visibility:"LOGGED_IN",
    description:"Surgeries, dates, reasons.",
    sections:[{ title:"Procedures", order:1, questions:[
      { text:"Major surgeries", questionType:"TEXTAREA", order:1 },
      { text:"Hospitalizations", questionType:"TEXTAREA", order:2 },
    ]}]},
  { slug:"family-history", title:"Family History", category:"Core Profile", visibility:"LOGGED_IN",
    description:"Hereditary conditions and patterns.",
    sections:[{ title:"Relatives", order:1, questions:[
      { text:"Family conditions", questionType:"TEXTAREA", order:1 },
    ]}]},
  { slug:"lifestyle-habits", title:"Lifestyle & Habits", category:"Core Profile", visibility:"LOGGED_IN",
    description:"Smoking, alcohol, sleep, activity, diet.",
    sections:[{ title:"Habits", order:1, questions:[
      { text:"Smoking", questionType:"SINGLE_CHOICE", options: JSON.stringify(["Never","Former","Current"]), order:1 },
      { text:"Alcohol (drinks/week)", questionType:"NUMBER", order:2 },
    ]}]},
  { slug:"nutrition-profile", title:"Nutrition Profile", category:"Core Profile", visibility:"LOGGED_IN",
    description:"Goals, restrictions, diets.",
    sections:[{ title:"Nutrition", order:1, questions:[
      { text:"Dietary restrictions", questionType:"TEXTAREA", order:1 },
      { text:"Nutrition goals", questionType:"TEXTAREA", order:2 },
    ]}]},
  { slug:"sleep-profile", title:"Sleep Profile", category:"Core Profile", visibility:"LOGGED_IN",
    description:"Sleep quality and schedule.",
    sections:[{ title:"Sleep", order:1, questions:[
      { text:"Average sleep hours", questionType:"NUMBER", order:1 },
      { text:"Snoring or apnea", questionType:"SINGLE_CHOICE", options: JSON.stringify(["No","Possible","Diagnosed"]), order:2 },
    ]}]},
  { slug:"mental-health-stress", title:"Mental Health & Stress", category:"Core Profile", visibility:"LOGGED_IN",
    description:"Mood, stress, anxiety.",
    sections:[{ title:"Mental", order:1, questions:[
      { text:"Stress level (0-10)", questionType:"NUMBER", order:1 },
      { text:"Anxiety or depression", questionType:"SINGLE_CHOICE", options: JSON.stringify(["No","Mild","Moderate","Severe"]), order:2 },
    ]}]},
  { slug:"activity-fitness", title:"Activity & Fitness", category:"Core Profile", visibility:"LOGGED_IN",
    description:"Workouts and activity goals.",
    sections:[{ title:"Activity", order:1, questions:[
      { text:"Workouts per week", questionType:"NUMBER", order:1 },
      { text:"Activity goals", questionType:"TEXTAREA", order:2 },
    ]}]},
  { slug:"vitals-self-report", title:"Vitals Self-Report", category:"Core Profile", visibility:"LOGGED_IN",
    description:"Weight, height, BP, HR, temperature.",
    sections:[{ title:"Vitals", order:1, questions:[
      { text:"Weight (kg)", questionType:"NUMBER", order:1 },
      { text:"Height (cm)", questionType:"NUMBER", order:2 },
    ]}]},
  { slug:"communication-consent", title:"Communication & Consent", category:"Core Profile", visibility:"LOGGED_IN",
    description:"Privacy consent and communication preferences.",
    sections:[{ title:"Consent", order:1, questions:[
      { text:"Accept privacy policy", questionType:"BOOLEAN", order:1 },
      { text:"Preferred contact method", questionType:"SINGLE_CHOICE", options: JSON.stringify(["Email","Phone","SMS"]), order:2 },
    ]}]},

  // Specialized
  { slug:"womens-health", title:"Women’s Health", category:"Specialized", visibility:"LOGGED_IN",
    description:"Cycle, hormonal changes, health.",
    sections:[{ title:"Women", order:1, questions:[
      { text:"Cycle regularity", questionType:"SINGLE_CHOICE", options: JSON.stringify(["Regular","Irregular","Post-menopause"]), order:1 },
      { text:"Hormonal therapy", questionType:"BOOLEAN", order:2 },
    ]}]},
  { slug:"mens-health", title:"Men’s Health", category:"Specialized", visibility:"LOGGED_IN",
    description:"Urology and andrology.",
    sections:[{ title:"Men", order:1, questions:[
      { text:"Urinary symptoms", questionType:"SINGLE_CHOICE", options: JSON.stringify(["None","Mild","Moderate","Severe"]), order:1 },
    ]}]},
  { slug:"chronic-followups", title:"Chronic Condition Follow-ups", category:"Specialized", visibility:"LOGGED_IN",
    description:"Short periodic check-ins (diabetes, HTN, asthma/COPD).",
    sections:[{ title:"Follow-ups", order:1, questions:[
      { text:"Blood glucose (if applicable)", questionType:"NUMBER", order:1 },
      { text:"Blood pressure (if applicable)", questionType:"TEXT", order:2 },
    ]}]},
  { slug:"pain-tracker", title:"Pain & Symptoms Tracker", category:"Specialized", visibility:"LOGGED_IN",
    description:"Intensity, location, triggers.",
    sections:[{ title:"Pain", order:1, questions:[
      { text:"Pain intensity (0-10)", questionType:"NUMBER", order:1 },
      { text:"Location", questionType:"TEXT", order:2 },
    ]}]},
  { slug:"device-linking", title:"Device Linking & Data Sharing", category:"Specialized", visibility:"LOGGED_IN",
    description:"Consents for wearables and trackers.",
    sections:[{ title:"Devices", order:1, questions:[
      { text:"Allow wearable data import", questionType:"BOOLEAN", order:1 },
    ]}]},
  { slug:"insurance-billing", title:"Insurance & Billing", category:"Specialized", visibility:"LOGGED_IN",
    description:"Insurance details.",
    sections:[{ title:"Insurance", order:1, questions:[
      { text:"Provider", questionType:"TEXT", order:1 },
      { text:"Member ID", questionType:"TEXT", order:2 },
    ]}]},
  { slug:"emergency-contacts", title:"Emergency Contacts", category:"Specialized", visibility:"LOGGED_IN",
    description:"Emergency contacts.",
    sections:[{ title:"Contacts", order:1, questions:[
      { text:"Primary contact", questionType:"TEXT", order:1 },
      { text:"Phone", questionType:"TEXT", order:2 },
    ]}]},

  // Commercial (plan-gated)
  { slug:"sexual-health-general", title:"Sexual Health – General", category:"Commercial", visibility:"PLAN_GATED", requiredPlans:"sexual_health",
    description:"Libido, sexual thoughts, activity changes.",
    sections:[{ title:"General", order:1, questions:[
      { text:"Changes in sexual thoughts or fantasies", questionType:"SINGLE_CHOICE", options: JSON.stringify(["Decreased","No change","Increased"]), order:1 },
      { text:"Changes in frequency of sexual intercourse", questionType:"SINGLE_CHOICE", options: JSON.stringify(["Decreased","No change","Increased"]), order:2 },
    ]}]},
  { slug:"sexual-health-men", title:"Sexual Health – Men", category:"Commercial", visibility:"PLAN_GATED", requiredPlans:"sexual_health",
    description:"Night/morning erections, muscle mass, hair changes.",
    sections:[{ title:"Male Sexual Health", order:1, questions:[
      { text:"Changes in frequency of erections during the night and morning", questionType:"SINGLE_CHOICE", options: JSON.stringify(["Decreased","No change","Increased"]), order:1 },
      { text:"Changes or loss of muscle mass", questionType:"SINGLE_CHOICE", options: JSON.stringify(["Loss","No change","Gain"]), order:2 },
      { text:"Changes in presence of hair on legs, hands, chest, back and face", questionType:"TEXTAREA", order:3 },
      { text:"Changes in density of hair on legs and hands", questionType:"SINGLE_CHOICE", options: JSON.stringify(["Decreased","No change","Increased"]), order:4 },
    ]}]},
  { slug:"sexual-health-women", title:"Sexual Health – Women", category:"Commercial", visibility:"PLAN_GATED", requiredPlans:"sexual_health",
    description:"Cycle, hormonal changes, hair.",
    sections:[{ title:"Female Sexual Health", order:1, questions:[
      { text:"Cycle changes", questionType:"TEXTAREA", order:1 },
      { text:"Hormonal changes", questionType:"TEXTAREA", order:2 },
      { text:"Changes in hair presence or density", questionType:"TEXTAREA", order:3 },
    ]}]},
  { slug:"psychological-wellbeing", title:"Psychological Wellbeing", category:"Commercial", visibility:"PLAN_GATED", requiredPlans:"psychology",
    description:"Anxiety, stress, depression, mood.",
    sections:[{ title:"Psychology", order:1, questions:[
      { text:"Anxiety level (0-10)", questionType:"NUMBER", order:1 },
      { text:"Depression level (0-10)", questionType:"NUMBER", order:2 },
    ]}]},
  { slug:"longevity-profile", title:"Longevity Profile", category:"Commercial", visibility:"PLAN_GATED", requiredPlans:"longevity",
    description:"Lifestyle and biomarkers related to longevity.",
    sections:[{ title:"Longevity", order:1, questions:[
      { text:"Fasting or time-restricted eating", questionType:"SINGLE_CHOICE", options: JSON.stringify(["No","Sometimes","Regularly"]), order:1 },
    ]}]},
];

async function upsertOne(q) {
  const created = await prisma.questionnaire.upsert({
    where: { slug: q.slug },
    update: {
      title: q.title,
      description: q.description ?? "",
      category: q.category ?? "",
      status: "ACTIVE",
      visibility: q.visibility,
      requiredPlans: q.requiredPlans ?? "",
      updatedAt: new Date(),
    },
    create: {
      slug: q.slug,
      title: q.title,
      description: q.description ?? "",
      category: q.category ?? "",
      status: "ACTIVE",
      visibility: q.visibility,
      requiredPlans: q.requiredPlans ?? "",
      sections: {
        create: (q.sections || []).map((s, i) => ({
          title: s.title || `Section ${i+1}`,
          order: s.order ?? i+1,
          questions: {
            create: (s.questions || []).map((qq, j) => ({
              text: qq.text,
              questionType: qq.questionType,
              isRequired: !!qq.isRequired,
              order: qq.order ?? j+1,
              options: qq.options || null,
            })),
          },
        })),
      },
    },
    include: { sections: { include: { questions: true } } },
  });
  return created.slug;
}

async function main() {
  for (const q of DATA) {
    await upsertOne(q);
  }
  console.log("seeded:", DATA.length);
}
main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
