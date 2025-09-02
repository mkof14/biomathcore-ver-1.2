const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Полная перезапись формы по slug:
 * - если форма существует: удаляем секции/вопросы и создаём заново
 * - если нет — создаём
 */
async function replaceForm({ slug, title, category, visibility='PUBLIC', gates=[], sensitive=false, anonymousAllowed=false, sections=[] }) {
  const existing = await prisma.form.findUnique({ where: { slug }, select: { id: true } });
  if (existing) {
    // очистка дочерних сущностей (вопросов и секций)
    await prisma.$transaction([
      prisma.answer.deleteMany({ where: { Question: { section: { formId: existing.id } } } }),
      prisma.question.deleteMany({ where: { section: { formId: existing.id } } }),
      prisma.formSection.deleteMany({ where: { formId: existing.id } }),
    ]);
    // обновим метаданные формы на всякий случай
    await prisma.form.update({
      where: { id: existing.id },
      data: { title, category, visibility, gates, sensitive, anonymousAllowed },
    });
  } else {
    await prisma.form.create({
      data: { slug, title, category, visibility, gates, sensitive, anonymousAllowed },
    });
  }

  const form = await prisma.form.findUnique({ where: { slug } });

  // создаём секции и вопросы
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    const sec = await prisma.formSection.create({
      data: { formId: form.id, title: s.title, order: i }
    });
    for (let j = 0; j < (s.questions || []).length; j++) {
      const q = s.questions[j];
      await prisma.question.create({
        data: {
          sectionId: sec.id,
          order: j,
          label: q.label,
          type: q.type,
          required: !!q.required,
          sensitivity: q.sensitivity || 'NONE',
          options: q.options || []
        }
      });
    }
  }
}

/** ===== Определения детальных форм ===== **/

async function seed() {
  // 1) General Wellness — расширенная
  await replaceForm({
    slug: 'general-wellness',
    title: 'General Wellness Assessment',
    category: 'General',
    sections: [
      {
        title: 'Profile Basics',
        questions: [
          { label: 'Age group', type: 'SINGLE_CHOICE', options: ['18–24','25–34','35–44','45–54','55–64','65+'], required: true },
          { label: 'Sex at birth', type: 'SINGLE_CHOICE', options: ['Female','Male','Intersex','Prefer not to say'], required: true },
          { label: 'Height (cm or in)', type: 'NUMBER', required: true },
          { label: 'Weight (kg or lb)', type: 'NUMBER', required: true },
          { label: 'Primary goal', type: 'SINGLE_CHOICE', options: ['Weight','Muscle','Endurance','Energy','Longevity','General health'] },
        ]
      },
      {
        title: 'Vitals & Measurements',
        questions: [
          { label: 'Resting heart rate (bpm)', type: 'NUMBER' },
          { label: 'Systolic BP (upper number, mmHg)', type: 'NUMBER' },
          { label: 'Diastolic BP (lower number, mmHg)', type: 'NUMBER' },
          { label: 'Body fat (%)', type: 'NUMBER' },
        ]
      },
      {
        title: 'Lifestyle',
        questions: [
          { label: 'Sleep hours per night', type: 'NUMBER', required: true },
          { label: 'Sleep quality', type: 'SINGLE_CHOICE', options: ['Very poor','Poor','Fair','Good','Excellent'] },
          { label: 'Average daily steps', type: 'NUMBER' },
          { label: 'Weekly activity (min)', type: 'NUMBER' },
          { label: 'Diet pattern', type: 'SINGLE_CHOICE', options: ['Balanced','High-protein','Low-carb','Vegetarian','Vegan','Keto','Other'] },
          { label: 'Alcohol (drinks/week)', type: 'NUMBER' },
          { label: 'Smoking', type: 'SINGLE_CHOICE', options: ['Never','Former','Occasional','Daily'] },
        ]
      },
      {
        title: 'Symptoms & Concerns',
        questions: [
          { label: 'Energy level (1–10)', type: 'NUMBER', required: true },
          { label: 'Pain level (0–10)', type: 'NUMBER' },
          { label: 'Main concerns (free text)', type: 'TEXTAREA' },
        ]
      }
    ]
  });

  // 2) Medical Profile — база здоровья
  await replaceForm({
    slug: 'medical-profile',
    title: 'Medical Profile',
    category: 'Medical',
    sections: [
      {
        title: 'Conditions',
        questions: [
          { label: 'Active conditions', type: 'MULTI_CHOICE',
            options: ['Hypertension','Diabetes','High cholesterol','Asthma','Depression','Anxiety','Thyroid disorder','PCOS','CAD/Heart disease','Cancer','Other','None'] },
          { label: 'Other conditions (free text)', type: 'TEXTAREA' },
        ]
      },
      {
        title: 'Medications & Supplements',
        questions: [
          { label: 'Current prescription meds (names & doses)', type: 'TEXTAREA' },
          { label: 'Supplements (names & doses)', type: 'TEXTAREA' },
        ]
      },
      {
        title: 'Allergies & Intolerances',
        questions: [
          { label: 'Allergies', type: 'MULTI_CHOICE', options: ['Penicillin','Sulfa drugs','NSAIDs','Nuts','Dairy','Gluten','Other','None'] },
          { label: 'Allergy details (free text)', type: 'TEXTAREA' },
        ]
      },
      {
        title: 'History',
        questions: [
          { label: 'Prior surgeries (with year)', type: 'TEXTAREA' },
          { label: 'Family history (select)', type: 'MULTI_CHOICE',
            options: ['Hypertension','Diabetes','High cholesterol','Stroke','Heart disease','Cancer','Dementia','Other','Unknown'] },
        ]
      },
      {
        title: 'Labs',
        questions: [
          { label: 'Months since last full labs', type: 'NUMBER' },
          { label: 'Any abnormal results (free text)', type: 'TEXTAREA' },
        ]
      }
    ]
  });

  // 3) Sexual Health — Female (скрыто в списке, аноним допустим)
  await replaceForm({
    slug: 'sexual-health-female',
    title: 'Sexual Health — Female',
    category: 'Sexual Health',
    visibility: 'PLAN_GATED',
    gates: ['sexual_health_addon'],
    sensitive: true,
    anonymousAllowed: true,
    sections: [
      {
        title: 'Cycle & Hormonal',
        questions: [
          { label: 'Cycle regularity', type: 'SINGLE_CHOICE', required: true,
            options: ['Very regular','Regular','Irregular','No cycle / Menopause'] },
          { label: 'Cycle length (days)', type: 'NUMBER' },
          { label: 'Hormonal symptoms frequency', type: 'SINGLE_CHOICE',
            options: ['Never','Rare','Sometimes','Often','Always'] },
        ]
      },
      {
        title: 'Contraception & History',
        questions: [
          { label: 'Current contraception', type: 'SINGLE_CHOICE',
            options: ['None','Pill','IUD','Implant','Barrier','Other'] },
          { label: 'Pregnancy history', type: 'SINGLE_CHOICE',
            options: ['Never','1','2','3+','Prefer not to say'] },
        ]
      },
      {
        title: 'STIs & Screening',
        questions: [
          { label: 'History of STIs', type: 'MULTI_CHOICE',
            options: ['Chlamydia','Gonorrhea','Syphilis','HPV','HSV','HIV','Other','No history'] },
          { label: 'Last STI screening (months ago)', type: 'NUMBER' }
        ]
      },
      {
        title: 'Symptoms & Function',
        questions: [
          { label: 'Pain with intercourse (0–10)', type: 'NUMBER' },
          { label: 'Lubrication issues', type: 'SINGLE_CHOICE', options: ['Never','Sometimes','Often','Always'] },
          { label: 'Satisfaction (1–10)', type: 'NUMBER' },
          { label: 'Notes (free text)', type: 'TEXTAREA' }
        ]
      },
      {
        title: 'Privacy',
        questions: [
          { label: 'Submit anonymously?', type: 'BOOLEAN' }
        ]
      }
    ]
  });

  // 4) Sexual Health — Male (скрыто в списке, аноним допустим)
  await replaceForm({
    slug: 'sexual-health-male',
    title: 'Sexual Health — Male',
    category: 'Sexual Health',
    visibility: 'PLAN_GATED',
    gates: ['sexual_health_addon'],
    sensitive: true,
    anonymousAllowed: true,
    sections: [
      {
        title: 'Function',
        questions: [
          { label: 'Erection quality (1–10)', type: 'NUMBER', required: true },
          { label: 'Morning erections (per week)', type: 'NUMBER' },
          { label: 'Ejaculation issues', type: 'SINGLE_CHOICE', options: ['None','Premature','Delayed','Painful','Other'] },
          { label: 'Satisfaction (1–10)', type: 'NUMBER' },
        ]
      },
      {
        title: 'Prostate & Symptoms',
        questions: [
          { label: 'Urination at night (times)', type: 'NUMBER' },
          { label: 'Weak stream / straining', type: 'SINGLE_CHOICE', options: ['Never','Rare','Sometimes','Often','Always'] },
        ]
      },
      {
        title: 'STIs & Screening',
        questions: [
          { label: 'History of STIs', type: 'MULTI_CHOICE',
            options: ['Chlamydia','Gonorrhea','Syphilis','HPV','HSV','HIV','Other','No history'] },
          { label: 'Last STI screening (months ago)', type: 'NUMBER' }
        ]
      },
      {
        title: 'Symptoms & Notes',
        questions: [
          { label: 'Genital pain/lesions/discharge', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
          { label: 'Notes', type: 'TEXTAREA' }
        ]
      },
      {
        title: 'Privacy',
        questions: [
          { label: 'Submit anonymously?', type: 'BOOLEAN' }
        ]
      }
    ]
  });

  console.log('Detailed forms seeded.');
}

seed().finally(() => prisma.$disconnect());
