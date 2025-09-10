import { prisma } from "../src/lib/prisma";

type QDef = {
  slug: string;
  title: string;
  description?: string;
  category?: string;
  visibility: "PUBLIC"|"LOGGED_IN"|"PLAN_GATED";
  requiredPlans?: string;
  sections: {
    title: string;
    description?: string;
    questions: {
      text: string;
      questionType: "TEXT"|"TEXTAREA"|"NUMBER"|"DATE"|"BOOLEAN"|"SINGLE_CHOICE"|"MULTI_CHOICE";
      isRequired?: boolean;
      order?: number;
      options?: string[];
    }[];
  }[];
};

const CHOICES_YN = ["Yes","No"];
const CHOICES_GENDER = ["Male","Female","Other","Prefer not to say"];
const CHOICES_ACTIVITY = ["Sedentary","Light","Moderate","Active","Athlete"];

const DATA: QDef[] = [
  { slug: "patient-questionnaire", title: "Patient Questionnaire (Onboarding)", description: "Personal details, contacts, language, preferences.", category: "Core Profile", visibility: "LOGGED_IN", sections: [{ title: "Personal", questions: [ { text: "First name", questionType: "TEXT", isRequired: true }, { text: "Last name", questionType: "TEXT", isRequired: true }, { text: "Date of birth", questionType: "DATE", isRequired: true }, { text: "Gender", questionType: "SINGLE_CHOICE", options: CHOICES_GENDER, isRequired: true }, { text: "Preferred language", questionType: "TEXT" }, { text: "Phone number", questionType: "TEXT" } ] }] },
  { slug: "medical-history", title: "Medical History", description: "Conditions, diagnoses, onset dates.", category: "Core Profile", visibility: "LOGGED_IN", sections: [{ title: "Conditions", questions: [ { text: "List your diagnosed conditions", questionType: "TEXTAREA" }, { text: "Date of primary diagnosis", questionType: "DATE" } ] }] },
  { slug: "medications-allergies", title: "Medications & Allergies", description: "Medications (dose, frequency) and allergies.", category: "Core Profile", visibility: "LOGGED_IN", sections: [{ title: "Medications & Allergies", questions: [ { text: "Current medications (name, dose, frequency)", questionType: "TEXTAREA" }, { text: "Drug allergies", questionType: "TEXTAREA" }, { text: "Food/environment allergies", questionType: "TEXTAREA" } ] }] },
  { slug: "surgical-hospitalization-history", title: "Surgical & Hospitalization History", description: "Past surgeries, hospitalizations, dates and reasons.", category: "Core Profile", visibility: "LOGGED_IN", sections: [{ title: "History", questions: [ { text: "Surgeries (with dates)", questionType: "TEXTAREA" }, { text: "Hospitalizations (with dates)", questionType: "TEXTAREA" } ] }] },
  { slug: "family-history", title: "Family History", description: "Hereditary conditions and patterns.", category: "Core Profile", visibility: "LOGGED_IN", sections: [{ title: "Family", questions: [ { text: "Hereditary conditions in your family", questionType: "TEXTAREA" }, { text: "Relationship of affected relatives", questionType: "TEXTAREA" } ] }] },
  { slug: "lifestyle-habits", title: "Lifestyle & Habits", description: "Smoking, alcohol, sleep, exercise, diet.", category: "Core Profile", visibility: "LOGGED_IN", sections: [{ title: "Habits", questions: [ { text: "Do you smoke?", questionType: "SINGLE_CHOICE", options: CHOICES_YN, isRequired: true }, { text: "Alcohol per week (drinks)", questionType: "NUMBER" }, { text: "Average sleep (hours/night)", questionType: "NUMBER" }, { text: "Weekly exercise (hours)", questionType: "NUMBER" } ] }] },
  { slug: "nutrition-profile", title: "Nutrition Profile", description: "Goals, restrictions, dietary pattern.", category: "Core Profile", visibility: "LOGGED_IN", sections: [{ title: "Nutrition", questions: [ { text: "Primary goals (weight loss, gain, maintenance)", questionType: "TEXTAREA" }, { text: "Dietary restrictions", questionType: "TEXTAREA" }, { text: "Diet type", questionType: "TEXT" } ] }] },
  { slug: "sleep-profile", title: "Sleep Profile", description: "Sleep quality, schedule, apnea, snoring.", category: "Core Profile", visibility: "LOGGED_IN", sections: [{ title: "Sleep", questions: [ { text: "Overall sleep quality", questionType: "SINGLE_CHOICE", options: ["Poor","Fair","Good","Excellent"] }, { text: "Snoring", questionType: "SINGLE_CHOICE", options: CHOICES_YN }, { text: "Screen for apnea history", questionType: "SINGLE_CHOICE", options: CHOICES_YN } ] }] },
  { slug: "mental-health-stress", title: "Mental Health & Stress", description: "Mood, stress, anxiety.", category: "Core Profile", visibility: "LOGGED_IN", sections: [{ title: "Mental Health", questions: [ { text: "Average stress level (0-10)", questionType: "NUMBER" }, { text: "Recent anxiety or low mood notes", questionType: "TEXTAREA" } ] }] },
  { slug: "activity-fitness", title: "Activity & Fitness", description: "Training, activity, goals.", category: "Core Profile", visibility: "LOGGED_IN", sections: [{ title: "Activity", questions: [ { text: "Activity level", questionType: "SINGLE_CHOICE", options: ["Sedentary","Light","Moderate","Active","Athlete"] }, { text: "Training goals", questionType: "TEXTAREA" } ] }] },
  { slug: "vitals-self-report", title: "Vitals Self-Report", description: "Weight, height, blood pressure, heart rate, temperature.", category: "Core Profile", visibility: "LOGGED_IN", sections: [{ title: "Vitals", questions: [ { text: "Weight (kg)", questionType: "NUMBER" }, { text: "Height (cm)", questionType: "NUMBER" }, { text: "Blood pressure (systolic/diastolic)", questionType: "TEXT" }, { text: "Resting heart rate (bpm)", questionType: "NUMBER" }, { text: "Temperature (°C)", questionType: "NUMBER" } ] }] },
  { slug: "communication-consent", title: "Communication & Consent", description: "HIPAA/Privacy consents, contact preferences.", category: "Core Profile", visibility: "LOGGED_IN", sections: [{ title: "Consent", questions: [ { text: "Agree to Privacy Policy", questionType: "BOOLEAN", isRequired: true }, { text: "Preferred contact method", questionType: "SINGLE_CHOICE", options: ["Email","Phone","SMS","Push"] } ] }] },

  { slug: "womens-health", title: "Women’s Health", description: "Cycle, hormonal changes, general health.", category: "Specialized", visibility: "LOGGED_IN", sections: [{ title: "Women’s Health", questions: [ { text: "Cycle regularity", questionType: "SINGLE_CHOICE", options: ["Regular","Irregular","Perimenopause","Menopause"] }, { text: "Symptoms to note", questionType: "TEXTAREA" } ] }] },
  { slug: "mens-health", title: "Men’s Health", description: "Urology and andrology topics.", category: "Specialized", visibility: "LOGGED_IN", sections: [{ title: "Men’s Health", questions: [ { text: "Urinary symptoms", questionType: "TEXTAREA" }, { text: "Prostate-related notes", questionType: "TEXTAREA" } ] }] },
  { slug: "chronic-condition-followups", title: "Chronic Condition Follow-ups", description: "Diabetes, hypertension, asthma/COPD short regular follow-ups.", category: "Specialized", visibility: "LOGGED_IN", sections: [{ title: "Follow-ups", questions: [ { text: "Last HbA1c (if diabetic)", questionType: "TEXT" }, { text: "Home BP readings (if hypertensive)", questionType: "TEXTAREA" } ] }] },
  { slug: "pain-symptoms-tracker", title: "Pain & Symptoms Tracker", description: "Intensity, location, triggers.", category: "Specialized", visibility: "LOGGED_IN", sections: [{ title: "Pain", questions: [ { text: "Pain intensity (0-10)", questionType: "NUMBER" }, { text: "Location and triggers", questionType: "TEXTAREA" } ] }] },
  { slug: "device-linking-and-data-sharing", title: "Device Linking & Data Sharing", description: "Consents for wearables/trackers.", category: "Specialized", visibility: "LOGGED_IN", sections: [{ title: "Devices", questions: [ { text: "Allow linking wearable devices", questionType: "BOOLEAN" }, { text: "Devices you own", questionType: "TEXT" } ] }] },
  { slug: "insurance-billing", title: "Insurance & Billing", description: "Insurance info.", category: "Specialized", visibility: "LOGGED_IN", sections: [{ title: "Insurance", questions: [ { text: "Insurance provider", questionType: "TEXT" }, { text: "Policy number", questionType: "TEXT" } ] }] },
  { slug: "emergency-contacts", title: "Emergency Contacts", description: "Emergency contacts.", category: "Specialized", visibility: "LOGGED_IN", sections: [{ title: "Contacts", questions: [ { text: "Primary emergency contact", questionType: "TEXT" }, { text: "Contact phone", questionType: "TEXT" }, { text: "Relationship", questionType: "TEXT" } ] }] },

  { slug: "sexual-health-general", title: "Sexual Health – General", description: "Libido, thoughts/fantasies, activity changes.", category: "Commercial", visibility: "PLAN_GATED", requiredPlans: "sexual_health", sections: [{ title: "General", questions: [ { text: "Changes in frequency of sexual thoughts or fantasies", questionType: "SINGLE_CHOICE", options: ["Decreased","No change","Increased"], isRequired: true }, { text: "Changes in frequency of sexual intercourse", questionType: "SINGLE_CHOICE", options: ["Decreased","No change","Increased"] } ] }] },
  { slug: "sexual-health-men", title: "Sexual Health – Men", description: "Night/morning erections, muscle mass, hair changes.", category: "Commercial", visibility: "PLAN_GATED", requiredPlans: "sexual_health", sections: [{ title: "Male Sexual Health", questions: [ { text: "Changes in frequency of erections during the night and morning", questionType: "SINGLE_CHOICE", options: ["Decreased","No change","Increased"], isRequired: true }, { text: "Changes or loss of muscle mass", questionType: "SINGLE_CHOICE", options: ["Loss","No change","Gain"] }, { text: "Changes in presence of hair on legs, hands, chest, back and face", questionType: "TEXTAREA" }, { text: "Changes in density of hair on legs and hands", questionType: "SINGLE_CHOICE", options: ["Decreased","No change","Increased"] } ] }] },
  { slug: "sexual-health-women", title: "Sexual Health – Women", description: "Cycle, hormonal changes, hair.", category: "Commercial", visibility: "PLAN_GATED", requiredPlans: "sexual_health", sections: [{ title: "Female Sexual Health", questions: [ { text: "Cycle changes", questionType: "SINGLE_CHOICE", options: ["More irregular","No change","More regular"] }, { text: "Hormonal symptoms", questionType: "TEXTAREA" }, { text: "Hair changes (presence/density across body areas)", questionType: "TEXTAREA" } ] }] },
  { slug: "psychological-wellbeing", title: "Psychological Wellbeing", description: "Anxiety, stress, depression, mood.", category: "Commercial", visibility: "PLAN_GATED", requiredPlans: "psychology", sections: [{ title: "Wellbeing", questions: [ { text: "Anxiety level (0-10)", questionType: "NUMBER" }, { text: "Stress level (0-10)", questionType: "NUMBER" }, { text: "Mood (0-10)", questionType: "NUMBER" }, { text: "Notes", questionType: "TEXTAREA" } ] }] },
  { slug: "longevity-profile", title: "Longevity Profile", description: "Healthy lifespan focus: sleep, activity, nutrition, biomarkers (high-level).", category: "Commercial", visibility: "PLAN_GATED", requiredPlans: "longevity", sections: [{ title: "Longevity", questions: [ { text: "Primary longevity goals", questionType: "TEXTAREA" }, { text: "Current longevity practices (sleep, activity, nutrition, supplements)", questionType: "TEXTAREA" } ] }] },
];

async function ensureAdmin() {
  await prisma.user.upsert({
    where: { email: "admin@biomath.local" },
    update: { role: "admin" },
    create: { email: "admin@biomath.local", role: "admin", name: "Admin" },
  });
}

async function upsertQuestionnaire(q: QDef) {
  return prisma.questionnaire.upsert({
    where: { slug: q.slug },
    update: {
      title: q.title,
      description: q.description || "",
      category: q.category || "General",
      status: "ACTIVE",
      visibility: q.visibility,
      requiredPlans: q.requiredPlans || "",
      sections: {
        deleteMany: {},
        create: q.sections.map((s, i) => ({
          title: s.title,
          description: s.description || "",
          order: i + 1,
          questions: {
            create: s.questions.map((qq, j) => ({
              text: qq.text,
              questionType: qq.questionType,
              isRequired: !!qq.isRequired,
              order: (qq.order ?? j+1),
              options: qq.options ? JSON.stringify(qq.options) : null,
            })),
          },
        })),
      },
    },
    create: {
      slug: q.slug,
      title: q.title,
      description: q.description || "",
      category: q.category || "General",
      status: "ACTIVE",
      visibility: q.visibility,
      requiredPlans: q.requiredPlans || "",
      sections: {
        create: q.sections.map((s, i) => ({
          title: s.title,
          description: s.description || "",
          order: i + 1,
          questions: {
            create: s.questions.map((qq, j) => ({
              text: qq.text,
              questionType: qq.questionType,
              isRequired: !!qq.isRequired,
              order: (qq.order ?? j+1),
              options: qq.options ? JSON.stringify(qq.options) : null,
            })),
          },
        })),
      },
    },
    include: { sections: { include: { questions: true } } },
  });
}

async function main() {
  await ensureAdmin();
  for (const q of DATA) await upsertQuestionnaire(q);
  console.log("Seeded questionnaires:", DATA.length);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async ()=>{ process.exit(0); });
