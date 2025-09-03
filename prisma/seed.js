const { PrismaClient, QuestionType, QuestionnaireVisibility } = require('@prisma/client');

const prisma = new PrismaClient();

const questionnaires = [
  // --- Main Profile (Mandatory) ---
  {
    slug: 'patient-questionnaire',
    title: 'Patient Questionnaire (Onboarding)',
    description: 'Personal data, contacts, language, preferences.',
    category: 'Main Profile',
    visibility: QuestionnaireVisibility.LOGGED_IN,
    sections: [{ title: 'Personal Information', questions: [{ text: 'Full Name', questionType: QuestionType.TEXT, isRequired: true }, { text: 'Date of Birth', questionType: QuestionType.DATE, isRequired: true }] }],
  },
  {
    slug: 'medical-history',
    title: 'Medical History',
    description: 'Illnesses, diagnoses, and dates.',
    category: 'Main Profile',
    visibility: QuestionnaireVisibility.LOGGED_IN,
    sections: [{ title: 'Medical Conditions', questions: [{ text: 'List any diagnosed medical conditions and their diagnosis dates.', questionType: QuestionType.TEXTAREA, isRequired: true }] }],
  },
  {
    slug: 'medications-allergies',
    title: 'Medications & Allergies',
    description: 'Medications (doses, frequency), allergies (drugs, food, environment).',
    category: 'Main Profile',
    visibility: QuestionnaireVisibility.LOGGED_IN,
    sections: [
        { title: 'Medications', questions: [{ text: 'List all current medications, including dosage and frequency.', questionType: QuestionType.TEXTAREA }] },
        { title: 'Allergies', questions: [{ text: 'List all known allergies.', questionType: QuestionType.TEXTAREA }] }
    ],
  },
  {
    slug: 'surgical-history',
    title: 'Surgical & Hospitalization History',
    description: 'Surgeries, dates, reasons.',
    category: 'Main Profile',
    visibility: QuestionnaireVisibility.LOGGED_IN,
    sections: [{ title: 'Surgical History', questions: [{ text: 'List all past surgeries and hospitalizations, including dates and reasons.', questionType: QuestionType.TEXTAREA }] }],
  },
  {
    slug: 'family-history',
    title: 'Family History',
    description: 'Hereditary diseases, patterns.',
    category: 'Main Profile',
    visibility: QuestionnaireVisibility.LOGGED_IN,
    sections: [{ title: 'Family Medical History', questions: [{ text: 'Describe any relevant family medical history (e.g., heart disease, cancer, diabetes).', questionType: QuestionType.TEXTAREA }] }],
  },
  {
    slug: 'lifestyle-habits',
    title: 'Lifestyle & Habits',
    description: 'Smoking, alcohol, sleep, sports, nutrition.',
    category: 'Main Profile',
    visibility: QuestionnaireVisibility.LOGGED_IN,
    sections: [
        { title: 'Habits', questions: [{ text: 'Describe your habits regarding smoking, alcohol consumption, and other relevant lifestyle factors.', questionType: QuestionType.TEXTAREA }] }
    ],
  },
  {
    slug: 'nutrition-profile',
    title: 'Nutrition Profile',
    description: 'Goals, restrictions, diets.',
    category: 'Main Profile',
    visibility: QuestionnaireVisibility.LOGGED_IN,
    sections: [{ title: 'Nutritional Information', questions: [{ text: 'Describe your typical diet, dietary restrictions, and nutritional goals.', questionType: QuestionType.TEXTAREA }] }],
  },
  {
    slug: 'sleep-profile',
    title: 'Sleep Profile',
    description: 'Sleep quality, schedule, apnea, snoring.',
    category: 'Main Profile',
    visibility: QuestionnaireVisibility.LOGGED_IN,
    sections: [{ title: 'Sleep Habits', questions: [{ text: 'Describe your sleep patterns, including quality, duration, and any issues like apnea or snoring.', questionType: QuestionType.TEXTAREA }] }],
  },
  {
    slug: 'mental-health-stress',
    title: 'Mental Health & Stress',
    description: 'Mood, stress, anxiety.',
    category: 'Main Profile',
    visibility: QuestionnaireVisibility.LOGGED_IN,
    sections: [{ title: 'Mental Wellbeing', questions: [{ text: 'Describe your current mental health state, including stress and anxiety levels.', questionType: QuestionType.TEXTAREA }] }],
  },
  {
    slug: 'activity-fitness',
    title: 'Activity & Fitness',
    description: 'Workouts, activity, goals.',
    category: 'Main Profile',
    visibility: QuestionnaireVisibility.LOGGED_IN,
    sections: [{ title: 'Physical Activity', questions: [{ text: 'Describe your typical physical activity and fitness routine.', questionType: QuestionType.TEXTAREA }] }],
  },
  {
    slug: 'vitals-self-report',
    title: 'Vitals Self-Report',
    description: 'Weight, height, blood pressure, pulse, temperature.',
    category: 'Main Profile',
    visibility: QuestionnaireVisibility.LOGGED_IN,
    sections: [{ title: 'Vital Signs', questions: [{ text: 'Please provide your latest self-reported vitals (Weight, Height, Blood Pressure, etc.).', questionType: QuestionType.TEXTAREA }] }],
  },
  {
    slug: 'communication-consent',
    title: 'Communication & Consent',
    description: 'HIPAA/Privacy consents, communication methods.',
    category: 'Main Profile',
    visibility: QuestionnaireVisibility.LOGGED_IN,
    sections: [{ title: 'Consent', questions: [{ text: 'I acknowledge and agree to the privacy policy and terms of use.', questionType: QuestionType.BOOLEAN, isRequired: true }] }],
  },

  // --- Specialized Questionnaires ---
  {
    slug: 'womens-health',
    title: 'Women’s Health',
    description: 'Cycle, hormonal changes, health.',
    category: 'Specialized',
    visibility: QuestionnaireVisibility.LOGGED_IN,
    sections: [{ title: 'Women’s Health', questions: [{ text: 'Please provide details about your menstrual cycle and any hormonal changes or concerns.', questionType: QuestionType.TEXTAREA }] }],
  },
  {
    slug: 'mens-health',
    title: 'Men’s Health',
    description: 'Urology, andrology.',
    category: 'Specialized',
    visibility: QuestionnaireVisibility.LOGGED_IN,
    sections: [{ title: 'Men’s Health', questions: [{ text: 'Please provide details about any urological or andrological health concerns.', questionType: QuestionType.TEXTAREA }] }],
  },

  // --- Sensitive Questionnaires ---
  {
    slug: 'sexual-health-general',
    title: 'Sexual Health – General',
    description: 'Libido, thoughts, fantasies, changes in activity.',
    category: 'Sensitive',
    visibility: QuestionnaireVisibility.PLAN_GATED,
    requiredPlans: 'premium-sexual-health,max',
    sections: [{ title: 'General Sexual Health', questions: [
      { text: 'Have you noticed changes in the frequency of sexual thoughts or fantasies?', questionType: QuestionType.TEXTAREA },
      { text: 'Have you noticed changes in the frequency of sexual intercourse?', questionType: QuestionType.TEXTAREA },
    ] }],
  },
  {
    slug: 'sexual-health-men',
    title: 'Sexual Health – Men',
    description: 'Night/morning erections, muscle mass, hair.',
    category: 'Sensitive',
    visibility: QuestionnaireVisibility.PLAN_GATED,
    requiredPlans: 'premium-sexual-health,max',
    sections: [{ title: 'Men’s Sexual Health', questions: [
        { text: 'Have you noticed changes in the frequency of erections during the night and morning?', questionType: QuestionType.TEXTAREA },
        { text: 'Have you noticed changes or loss of muscle mass?', questionType: QuestionType.TEXTAREA },
        { text: 'Have you noticed changes in the presence or density of hair on your legs, hands, chest, back, and face?', questionType: QuestionType.TEXTAREA },
    ] }],
  },
  {
    slug: 'psychological-wellbeing',
    title: 'Psychological Wellbeing',
    description: 'Anxiety, stress, depression, mood.',
    category: 'Sensitive',
    visibility: QuestionnaireVisibility.PLAN_GATED,
    requiredPlans: 'premium-mental-health,max',
    sections: [{ title: 'Psychological State', questions: [{ text: 'Please describe your psychological wellbeing, including any feelings of anxiety, stress, or depression.', questionType: QuestionType.TEXTAREA }] }],
  },
];

async function main() {
  console.log(`Start seeding ...`);

  for (const q of questionnaires) {
    const questionnaire = await prisma.questionnaire.create({
      data: {
        slug: q.slug,
        title: q.title,
        description: q.description,
        category: q.category,
        visibility: q.visibility,
        requiredPlans: q.requiredPlans || '',
        sections: {
          create: q.sections.map((s) => ({
            title: s.title,
            order: s.order || 0,
            questions: {
              create: s.questions.map((ques, index) => ({
                text: ques.text,
                questionType: ques.questionType,
                isRequired: ques.isRequired || false,
                options: ques.options || null,
                order: ques.order || index,
              })),
            },
          })),
        },
      },
    });
    console.log(`Created questionnaire: ${questionnaire.title}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
