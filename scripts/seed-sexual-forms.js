const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function upsertForm(input) {
  return prisma.form.upsert({
    where: { slug: input.slug },
    create: {
      slug: input.slug,
      title: input.title,
      category: input.category ?? null,
      visibility: input.visibility ?? 'PLAN_GATED',
      gates: input.gates ?? ['sexual_health_addon'],
      sensitive: input.sensitive ?? true,
      anonymousAllowed: input.anonymousAllowed ?? true,
      sections: {
        create: input.sections.map((s, sIdx) => ({
          title: s.title,
          order: sIdx,
          questions: {
            create: s.questions.map((q, qIdx) => ({
              order: qIdx,
              label: q.label,
              type: q.type,
              required: !!q.required,
              sensitivity: q.sensitivity ?? 'HIGH',
              options: q.options ?? [],
              unit: q.unit ?? null
            }))
          }
        }))
      }
    },
    update: {
      title: input.title,
      category: input.category ?? null,
      visibility: input.visibility ?? 'PLAN_GATED',
      gates: input.gates ?? ['sexual_health_addon'],
      sensitive: input.sensitive ?? true,
      anonymousAllowed: input.anonymousAllowed ?? true
    }
  });
}

async function run() {
  // 1) Sexual Health — General
  await upsertForm({
    slug: 'sexual-health-general',
    title: 'Sexual Health — General',
    category: 'Sexual Health',
    sections: [
      {
        title: 'History',
        questions: [
          { label: 'Age', type: 'NUMBER', required: true },
          { label: 'Sex assigned at birth', type: 'SINGLE_CHOICE', options: ['Female','Male','Intersex','Prefer not to say'] },
          { label: 'Gender identity', type: 'SINGLE_CHOICE', options: ['Woman','Man','Non-binary','Other','Prefer not to say'] },
          { label: 'Sexual activity in last 12 months', type: 'SINGLE_CHOICE', options: ['Yes','No','Prefer not to say'] }
        ]
      },
      {
        title: 'Partners & Protection',
        questions: [
          { label: 'Number of partners in last 12 months', type: 'NUMBER' },
          { label: 'Protection used', type: 'MULTI_CHOICE', options: ['Condoms','Dental dam','PrEP/PEP','None','Prefer not to say'] }
        ]
      },
      {
        title: 'Symptoms & STIs',
        questions: [
          { label: 'Any current symptoms', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
          { label: 'Describe symptoms', type: 'TEXTAREA' },
          { label: 'History of STIs', type: 'MULTI_CHOICE', options: ['Chlamydia','Gonorrhea','Syphilis','HPV','HSV','HIV','Other','No history'] },
          { label: 'Last STI screening (months ago)', type: 'NUMBER' }
        ]
      }
    ]
  });

  # 2) Sexual Health — Female
  await upsertForm({
    slug: 'sexual-health-female',
    title: 'Sexual Health — Female',
    category: 'Sexual Health',
    sections: [
      {
        title: 'Gynecological',
        questions: [
          { label: 'Menstrual cycle regularity', type: 'SINGLE_CHOICE', options: ['Regular','Irregular','Amenorrhea','Postmenopausal'] },
          { label: 'Painful periods (dysmenorrhea)', type: 'SINGLE_CHOICE', options: ['None','Mild','Moderate','Severe'] },
          { label: 'Contraception', type: 'MULTI_CHOICE', options: ['Pill','IUD','Implant','Condoms','None','Other'] }
        ]
      },
      {
        title: 'Pregnancy & OB History',
        questions: [
          { label: 'Currently pregnant', type: 'SINGLE_CHOICE', options: ['Yes','No','Unsure'] },
          { label: 'Number of pregnancies (G)', type: 'NUMBER' },
          { label: 'Number of births (P)', type: 'NUMBER' },
          { label: 'Breastfeeding', type: 'SINGLE_CHOICE', options: ['Yes','No'] }
        ]
      },
      {
        title: 'Symptoms',
        questions: [
          { label: 'Pelvic pain', type: 'SINGLE_CHOICE', options: ['None','Mild','Moderate','Severe'] },
          { label: 'Dyspareunia (pain with intercourse)', type: 'SINGLE_CHOICE', options: ['Never','Sometimes','Often'] },
          { label: 'Vaginal discharge/odor/itching', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
          { label: 'Notes', type: 'TEXTAREA' }
        ]
      }
    ]
  });

  // 3) Sexual Health — Male
  await upsertForm({
    slug: 'sexual-health-male',
    title: 'Sexual Health — Male',
    category: 'Sexual Health',
    sections: [
      {
        title: 'Urologic',
        questions: [
          { label: 'Erectile difficulties', type: 'SINGLE_CHOICE', options: ['Never','Sometimes','Often','Always'] },
          { label: 'Ejaculatory issues', type: 'SINGLE_CHOICE', options: ['None','Premature','Delayed','Painful'] },
          { label: 'Urinary symptoms', type: 'MULTI_CHOICE', options: ['Frequency','Urgency','Weak stream','Nocturia','None'] }
        ]
      },
      {
        title: 'STIs & Screening',
        questions: [
          { label: 'History of STIs', type: 'MULTI_CHOICE', options: ['Chlamydia','Gonorrhea','Syphilis','HPV','HSV','HIV','Other','No history'] },
          { label: 'Last STI screening (months ago)', type: 'NUMBER' }
        ]
      },
      {
        title: 'Symptoms',
        questions: [
          { label: 'Penile pain/discharge/lesions', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
          { label: 'Testicular pain/swelling', type: 'SINGLE_CHOICE', options: ['Yes','No'] },
          { label: 'Notes', type: 'TEXTAREA' }
        ]
      }
    ]
  });

  console.log('Seeded sexual health forms: general, female, male');
}

run().finally(async () => prisma.$disconnect());
