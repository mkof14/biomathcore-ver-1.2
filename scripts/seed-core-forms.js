/**
 * Унифицированный сидер анкет BioMath Core:
 * - только поддерживаемые типы: TEXT, TEXTAREA, NUMBER, DATE, BOOLEAN, SINGLE_CHOICE, MULTI_CHOICE
 * - делает upsert по slug
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function upsertForm(def) {
  // Удаляем старые секции/вопросы, чтобы не было "Unsupported question type"
  const prev = await prisma.form.findUnique({ where: { slug: def.slug }, select: { id: true } });
  if (prev) {
    await prisma.question.deleteMany({ where: { section: { formId: prev.id } } });
    await prisma.formSection.deleteMany({ where: { formId: prev.id } });
  }

  // Upsert формы и вложенных секций/вопросов
  await prisma.form.upsert({
    where: { slug: def.slug },
    update: {
      title: def.title,
      category: def.category || null,
      visibility: def.visibility || 'PUBLIC',
      gates: def.gates || [],
      anonymousAllowed: !!def.anonymousAllowed,
      sections: {
        create: def.sections.map((s, si) => ({
          title: s.title,
          order: si,
          questions: {
            create: (s.questions || []).map((q, qi) => ({
              label: q.label,
              type: q.type,                // строго из enum
              required: !!q.required,
              sensitivity: q.sensitivity || 'LOW',
              options: q.options || [],
              order: qi,
            })),
          },
        })),
      },
    },
    create: {
      slug: def.slug,
      title: def.title,
      category: def.category || null,
      visibility: def.visibility || 'PUBLIC',
      gates: def.gates || [],
      anonymousAllowed: !!def.anonymousAllowed,
      sections: {
        create: def.sections.map((s, si) => ({
          title: s.title,
          order: si,
          questions: {
            create: (s.questions || []).map((q, qi) => ({
              label: q.label,
              type: q.type,
              required: !!q.required,
              sensitivity: q.sensitivity || 'LOW',
              options: q.options || [],
              order: qi,
            })),
          },
        })),
      },
    },
  });
}

/* ===== Определения анкет ===== */

const FORMS = [

  // 0) Patient Questionnaire (основная, традиционная)
  {
    slug: 'patient-questionnaire',
    title: 'Patient Questionnaire',
    category: 'General',
    visibility: 'PUBLIC',
    anonymousAllowed: false,
    sections: [
      {
        title: 'General Personal Information',
        questions: [
          { label: 'Full Name', type: 'TEXT', required: true },
          { label: 'Date Of Birth', type: 'DATE', required: true },
          { label: 'Gender', type: 'SINGLE_CHOICE', options: ['Male','Female','Other','Prefer not to say'], required: true },
          { label: 'Phone Number', type: 'TEXT' },
          { label: 'Email Address', type: 'TEXT' },
          { label: 'Address', type: 'TEXTAREA' },
          { label: 'City', type: 'TEXT' },
          { label: 'State/Province', type: 'TEXT' },
          { label: 'Country', type: 'TEXT' },
          { label: 'Postal Code', type: 'TEXT' },
          { label: 'Preferred Language', type: 'TEXT' },
        ],
      },
      {
        title: 'Medical Information',
        questions: [
          { label: 'Current Medications (with dosage and frequency)', type: 'TEXTAREA' },
          { label: 'Allergies (medications, food, environmental)', type: 'TEXTAREA' },
          { label: 'Past Medical History (major illnesses, chronic conditions)', type: 'TEXTAREA' },
          { label: 'Past Surgeries/Hospitalizations (dates, reasons)', type: 'TEXTAREA' },
          { label: 'Vaccination History (recent)', type: 'TEXTAREA' },
          { label: 'Mental Health History (diagnoses, therapy, current state)', type: 'TEXTAREA' },
        ],
      },
      {
        title: 'Lifestyle',
        questions: [
          { label: 'Occupation', type: 'TEXT' },
          { label: 'Physical Activity Level', type: 'SINGLE_CHOICE', options: ['Low','Moderate','High'] },
          { label: 'Exercise Routine (type, frequency, duration)', type: 'TEXTAREA' },
          { label: 'Dietary Habits', type: 'TEXTAREA' },
          { label: 'Dietary Restrictions/Preferences', type: 'TEXTAREA' },
          { label: 'Smoking Status', type: 'SINGLE_CHOICE', options: ['Never','Former','Current'] },
          { label: 'Alcohol Consumption', type: 'SINGLE_CHOICE', options: ['None','Occasional','Moderate','High'] },
          { label: 'Sleep Quality (hours, issues)', type: 'TEXTAREA' },
          { label: 'Stress Levels (1–10)', type: 'NUMBER' },
          { label: 'Caffeine Consumption (cups/day)', type: 'NUMBER' },
        ],
      },
      {
        title: 'Health Goals & Concerns',
        questions: [
          { label: 'Primary Health Concerns', type: 'TEXTAREA' },
          { label: 'Main Health Goals', type: 'TEXTAREA' },
          { label: 'What do you hope to achieve with BioMath Core?', type: 'TEXTAREA' },
        ],
      },
    ],
  },

  // 1) Medical Profile (унифицировано)
  {
    slug: 'medical-profile',
    title: 'Medical Profile',
    category: 'Medical',
    visibility: 'PUBLIC',
    sections: [
      {
        title: 'Conditions',
        questions: [
          { label: 'Active conditions', type: 'MULTI_CHOICE', options: ['Hypertension','Diabetes','High cholesterol','Asthma','Depression','Anxiety','Thyroid disorder','PCOS','CAD/Heart disease','Cancer','Other','None'] },
          { label: 'Other conditions (free text)', type: 'TEXTAREA' },
        ],
      },
      {
        title: 'Medications & Supplements',
        questions: [
          { label: 'Current prescription meds (names & doses)', type: 'TEXTAREA' },
          { label: 'Supplements (names & doses)', type: 'TEXTAREA' },
        ],
      },
      {
        title: 'Allergies & Adverse Reactions',
        questions: [
          { label: 'Drug allergies', type: 'TEXTAREA' },
          { label: 'Adverse reactions experienced', type: 'TEXTAREA' },
        ],
      },
    ],
  },

  // 2) General Wellness
  {
    slug: 'general-wellness',
    title: 'General Wellness',
    category: 'General',
    visibility: 'PUBLIC',
    sections: [
      {
        title: 'Profile Basics',
        questions: [
          { label: 'Age group', type: 'SINGLE_CHOICE', options: ['18–24','25–34','35–44','45–54','55–64','65+'], required: true },
          { label: 'Sex at birth', type: 'SINGLE_CHOICE', options: ['Male','Female','Intersex/Other'], required: true },
          { label: 'Height (cm or in)', type: 'NUMBER', required: true },
          { label: 'Weight (kg or lb)', type: 'NUMBER', required: true },
          { label: 'Primary goal', type: 'SINGLE_CHOICE', options: ['Weight','Energy','Sleep','Longevity','Athletic performance'] },
        ],
      },
      {
        title: 'Vitals & Measurements',
        questions: [
          { label: 'Average sleep (hrs/night)', type: 'NUMBER' },
          { label: 'Resting heart rate (bpm)', type: 'NUMBER' },
          { label: 'Recent blood pressure (systolic/diastolic)', type: 'TEXT' },
          { label: 'Waist circumference (cm or in)', type: 'NUMBER' },
        ],
      },
      {
        title: 'Lifestyle',
        questions: [
          { label: 'Work pattern', type: 'SINGLE_CHOICE', options: ['Office','Remote','Shift','Mixed'] },
          { label: 'Exercise frequency', type: 'SINGLE_CHOICE', options: ['Rarely','1–2x/week','3–4x/week','5+ times/week'] },
          { label: 'Alcohol frequency', type: 'SINGLE_CHOICE', options: ['Never','Occasional','Weekly','Daily'] },
          { label: 'Tobacco/Nicotine', type: 'SINGLE_CHOICE', options: ['Never','Former','Current'] },
          { label: 'Recreational substances (if any)', type: 'TEXTAREA' },
        ],
      },
    ],
  },

  // 3) Mental Health Check-In
  {
    slug: 'mental-health',
    title: 'Mental Health Check-In',
    category: 'Psychology',
    visibility: 'PLAN_GATED',
    gates: ['psychology_addon'],
    sections: [
      {
        title: 'Mood & Stress',
        questions: [
          { label: 'Average mood (1–10)', type: 'NUMBER', required: true },
          { label: 'Stress level (1–10)', type: 'NUMBER' },
          { label: 'Current concerns (free text)', type: 'TEXTAREA' },
        ],
      },
      {
        title: 'Support',
        questions: [
          { label: 'Has social support?', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
          { label: 'Therapy or counseling now?', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
        ],
      },
    ],
  },

  // 4) Sexual Health — General
  {
    slug: 'sexual-health-general',
    title: 'Sexual Health — General',
    category: 'Sexual Health',
    visibility: 'PLAN_GATED',
    gates: ['sexual_health'],
    sections: [
      {
        title: 'Activity',
        questions: [
          { label: 'Sexual activity frequency', type: 'SINGLE_CHOICE', options: ['Never','Monthly','Weekly','Several times/week','Daily'] },
          { label: 'Number of partners in last 12 months', type: 'NUMBER' },
        ],
      },
      {
        title: 'STIs & Screening',
        questions: [
          { label: 'History of STIs', type: 'MULTI_CHOICE', options: ['Chlamydia','Gonorrhea','Syphilis','HPV','HSV','HIV','Other','No history'] },
          { label: 'Last STI screening (months ago)', type: 'NUMBER' },
        ],
      },
      {
        title: 'Symptoms',
        questions: [
          { label: 'Any genital pain/discharge/lesions', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
          { label: 'Notes', type: 'TEXTAREA' },
        ],
      },
    ],
  },

  // 5) Sexual Health — Female
  {
    slug: 'sexual-health-female',
    title: 'Sexual Health — Female',
    category: 'Sexual Health',
    visibility: 'PLAN_GATED',
    gates: ['sexual_health'],
    sections: [
      {
        title: 'Cycle & Hormones',
        questions: [
          { label: 'Menstrual cycle regularity', type: 'SINGLE_CHOICE', options: ['Regular','Irregular','No periods'] },
          { label: 'Cycle length (days)', type: 'NUMBER' },
          { label: 'PMS symptoms (if applicable)', type: 'MULTI_CHOICE', options: ['Cramps','Bloating','Mood changes','Breast tenderness','Headache','Other'] },
        ],
      },
      {
        title: 'Reproductive Health',
        questions: [
          { label: 'Currently pregnant or planning', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
          { label: 'Contraception', type: 'SINGLE_CHOICE', options: ['None','Pill','IUD','Implant','Condom','Other'] },
        ],
      },
      {
        title: 'Symptoms',
        questions: [
          { label: 'Pelvic pain/discomfort', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
          { label: 'Vaginal dryness or discomfort', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
          { label: 'Notes', type: 'TEXTAREA' },
        ],
      },
    ],
  },

  // 6) Sexual Health — Male
  {
    slug: 'sexual-health-male',
    title: 'Sexual Health — Male',
    category: 'Sexual Health',
    visibility: 'PLAN_GATED',
    gates: ['sexual_health'],
    sections: [
      {
        title: 'Hormones & Function',
        questions: [
          { label: 'Morning/night erections changed?', type: 'SINGLE_CHOICE', options: ['No change','Less frequent','More frequent'] },
          { label: 'Sexual desire changed?', type: 'SINGLE_CHOICE', options: ['No change','Decreased','Increased'] },
          { label: 'Muscle mass changes?', type: 'SINGLE_CHOICE', options: ['No change','Decreased','Increased'] },
        ],
      },
      {
        title: 'Hair Changes',
        questions: [
          { label: 'Body hair presence (legs, arms, chest, back, face) changed?', type: 'SINGLE_CHOICE', options: ['No change','Less','More'] },
          { label: 'Hair density changed?', type: 'SINGLE_CHOICE', options: ['No change','Less dense','More dense'] },
        ],
      },
      {
        title: 'Symptoms',
        questions: [
          { label: 'Penile pain/discharge/lesions', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
          { label: 'Testicular pain/swelling', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
          { label: 'Notes', type: 'TEXTAREA' },
        ],
      },
    ],
  },

  // 7) Senior Profile (55+)
  {
    slug: 'senior-profile',
    title: 'Senior Profile (55+)',
    category: 'Seniors',
    visibility: 'PUBLIC',
    sections: [
      {
        title: 'About You',
        questions: [
          { label: 'Age', type: 'NUMBER', required: true },
          { label: 'Gender', type: 'SINGLE_CHOICE', options: ['Male','Female','Other'], required: true },
          { label: 'Living situation', type: 'SINGLE_CHOICE', options: ['Alone','With family','With partner','Assisted living'] },
          { label: 'Location', type: 'SINGLE_CHOICE', options: ['City','Suburb','Rural'] },
        ],
      },
      {
        title: 'Daily Activity',
        questions: [
          { label: 'Outdoor walking frequency', type: 'SINGLE_CHOICE', options: ['Rarely','Sometimes','Often','Daily'] },
          { label: 'Any physical activity (e.g., garden, walks)?', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
          { label: 'Hours of sleep per day', type: 'NUMBER' },
          { label: 'Hobbies that bring joy', type: 'TEXTAREA' },
        ],
      },
      {
        title: 'Meds & Supplements',
        questions: [
          { label: 'Do you take any medications?', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
          { label: 'Medication list (optional)', type: 'TEXTAREA' },
          { label: 'Allergies to medications?', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
          { label: 'Vitamins / supplements', type: 'TEXTAREA' },
        ],
      },
      {
        title: 'Wellbeing',
        questions: [
          { label: 'How do you feel lately?', type: 'SINGLE_CHOICE', options: ['Energetic','Tired','Anxious','Calm'] },
          { label: 'Do you experience sadness/anxiety?', type: 'SINGLE_CHOICE', options: ['Often','Sometimes','Rarely','Never'] },
          { label: 'Do you have someone to talk to when it’s hard?', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
        ],
      },
      {
        title: 'Technology',
        questions: [
          { label: 'Have a smartphone/tablet?', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
          { label: 'Use health or social apps?', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
          { label: 'Would like health reminders on phone?', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
        ],
      },
      {
        title: 'Goals',
        questions: [
          { label: 'What would you like to improve?', type: 'TEXTAREA' },
          { label: 'Priority (energy, sleep, less pain, more activity)', type: 'TEXTAREA' },
          { label: 'Ready to try new habits?', type: 'SINGLE_CHOICE', options: ['Yes','No','Maybe'] },
        ],
      },
    ],
  },
];

async function run() {
  for (const f of FORMS) {
    await upsertForm(f);
    console.log('Upserted:', f.slug);
  }
}

run()
  .then(() => console.log('✅ Forms seeded/updated.'))
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
