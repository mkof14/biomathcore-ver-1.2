const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function upsertForm(payload) {
  return prisma.form.upsert({
    where: { slug: payload.slug },
    update: {},
    create: {
      slug: payload.slug,
      title: payload.title,
      category: payload.category ?? null,
      visibility: payload.visibility ?? 'PUBLIC',
      gates: payload.gates ?? [],
      sensitive: !!payload.sensitive,
      anonymousAllowed: !!payload.anonymousAllowed,
      sections: {
        create: payload.sections.map((sec, i)=>({
          title: sec.title, order: i,
          questions: { create: (sec.questions||[]).map((q, j)=>({
            order: j,
            label: q.label,
            type: q.type,
            required: !!q.required,
            sensitivity: q.sensitivity ?? 'NONE',
            options: q.options ?? [],
          })) }
        }))
      }
    }
  });
}

async function run() {
  // 1) Patient Questionnaire (общее)
  await upsertForm({
    slug: 'patient-questionnaire',
    title: 'Patient Questionnaire',
    category: 'General',
    visibility: 'PUBLIC',
    sections: [
      {
        title: 'General Information',
        questions: [
          { label:'Gender', type:'SINGLE_CHOICE', options:['Male','Female','Other/Prefer not to say'], required:true },
          { label:'Age', type:'NUMBER', required:true },
          { label:'Height (cm / ft-in)', type:'NUMBER', required:true },
          { label:'Weight (kg / lb)', type:'NUMBER', required:true },
          { label:'Marital Status', type:'SINGLE_CHOICE', options:['Single','Married','Partner','Divorced','Widowed'] },
          { label:'Education Level', type:'SINGLE_CHOICE', options:['High school','College','Bachelor','Master','PhD'] },
          { label:'Occupation', type:'TEXT' },
          { label:'Time zone', type:'TEXT' },
        ]
      },
      {
        title: 'Genetics & Family History',
        questions: [
          { label:'Family history of chronic diseases (diabetes, obesity, HTN, cancer)', type:'TEXTAREA' },
          { label:'Family history of mental health conditions', type:'TEXTAREA' },
          { label:'Known genetic variants/mutations', type:'TEXTAREA' },
        ]
      },
      {
        title: 'Lifestyle & Habits',
        questions: [
          { label:'Average sleep (hours/night)', type:'NUMBER' },
          { label:'Stress frequency', type:'SINGLE_CHOICE', options:['Rarely','Sometimes','Often','Constant'] },
          { label:'How do you cope with stress?', type:'TEXTAREA' },
          { label:'Physical activity (type & frequency)', type:'TEXTAREA' },
          { label:'Dietary pattern', type:'SINGLE_CHOICE', options:['Omnivore','Vegetarian','Vegan','Keto','Intermittent fasting','Other'] },
          { label:'Alcohol use', type:'SINGLE_CHOICE', options:['Never','Monthly','Weekly','Daily'] },
          { label:'Smoking', type:'SINGLE_CHOICE', options:['No','Former','Yes'] },
          { label:'Recreational substances', type:'TEXT' },
          { label:'Screen time (hours/day)', type:'NUMBER' },
          { label:'Hobbies that help you relax', type:'TEXTAREA' },
        ]
      },
      {
        title: 'Medications & Supplements',
        questions: [
          { label:'Prescription meds (names, dose, frequency)', type:'TEXTAREA' },
          { label:'Supplements/vitamins (what & why)', type:'TEXTAREA' },
          { label:'Drug allergies', type:'TEXT' },
          { label:'Any side effects experienced', type:'TEXTAREA' },
        ]
      },
      {
        title: 'Mental & Emotional',
        questions: [
          { label:'Current emotional state', type:'SINGLE_CHOICE', options:['Low','Flat','Okay','Good','Great'] },
          { label:'Mood swings?', type:'SINGLE_CHOICE', options:['No','Sometimes','Often'] },
          { label:'Anxiety / depression / other', type:'TEXTAREA' },
          { label:'Seeing therapist/coach?', type:'SINGLE_CHOICE', options:['No','Sometimes','Regularly'] },
          { label:'Supportive environment?', type:'SINGLE_CHOICE', options:['No','Some','Yes'] },
        ]
      },
      {
        title: 'Environment',
        questions: [
          { label:'Where do you live?', type:'SINGLE_CHOICE', options:['City','Suburb','Rural'] },
          { label:'Nearby industrial zones / air pollution?', type:'SINGLE_CHOICE', options:['No','Some','High'] },
          { label:'Do you use water/air filters?', type:'SINGLE_CHOICE', options:['No','Yes'] },
          { label:'Pets', type:'TEXT' },
          { label:'Time in nature (days/week)', type:'NUMBER' },
        ]
      },
      {
        title: 'Tech & Devices',
        questions: [
          { label:'Wearables used (watch, sleep, HR)?', type:'TEXTAREA' },
          { label:'Health/fitness apps', type:'TEXTAREA' },
          { label:'Share device data with BioMath Core?', type:'SINGLE_CHOICE', options:['Yes','No'] },
        ]
      },
      {
        title: 'Goals & Motivation',
        questions: [
          { label:'Primary health concerns', type:'TEXTAREA' },
          { label:'Main health goals (3 months)', type:'TEXTAREA' },
          { label:'Meaning of “wellbeing” for you', type:'TEXTAREA' },
          { label:'Barriers to change', type:'TEXTAREA' },
          { label:'Surgeries / procedures (with dates)', type:'TEXTAREA' },
        ]
      }
    ]
  });

  // 2) Mental Health (plan-gated)
  await upsertForm({
    slug: 'mental-health',
    title: 'Mental Health Check-In',
    category: 'Psychology',
    visibility: 'PLAN_GATED',
    gates: ['psychology_addon'],
    sensitive: true,
    anonymousAllowed: true,
    sections: [
      { title:'Mood & Stress', questions: [
        { label:'Mood (1–10)', type:'NUMBER', required:true, sensitivity:'MEDIUM' },
        { label:'Stress (1–10)', type:'NUMBER', sensitivity:'MEDIUM' },
        { label:'Current concerns', type:'TEXTAREA', sensitivity:'HIGH' },
      ]},
      { title:'Support', questions: [
        { label:'Has social support?', type:'SINGLE_CHOICE', options:['No','Some','Good'] },
        { label:'In therapy now?', type:'SINGLE_CHOICE', options:['No','Sometimes','Regularly'] },
      ]},
    ]
  });

  // 3–5) Sexual Health (general/female/male) — скрытые в общем списке
  const sexualCommon = [
    { title:'Activity & Safety', questions: [
      { label:'Sexual activity in last 3 months', type:'SINGLE_CHOICE', options:['No','Yes'] },
      { label:'Contraception / protection', type:'TEXT' },
      { label:'Number of partners (last year)', type:'NUMBER' },
    ]},
    { title:'STIs & Screening', questions: [
      { label:'History of STIs', type:'MULTI_CHOICE',
        options:['Chlamydia','Gonorrhea','Syphilis','HPV','HSV','HIV','Other','No history'] },
      { label:'Last STI screening (months ago)', type:'NUMBER' }
    ]},
  ];

  await upsertForm({
    slug: 'sexual-health-general',
    title: 'Sexual Health — General',
    category: 'Sexual Health',
    visibility: 'PLAN_GATED',
    gates: ['sexual_health_addon'],
    sensitive: true,
    anonymousAllowed: true,
    sections: [
      ...sexualCommon,
      { title:'Symptoms', questions: [
        { label:'Pain / discomfort', type:'SINGLE_CHOICE', options:['No','Mild','Moderate','Severe'] },
        { label:'Notes', type:'TEXTAREA' }
      ]}
    ]
  });

  await upsertForm({
    slug: 'sexual-health-female',
    title: 'Sexual Health — Female',
    category: 'Sexual Health',
    visibility: 'PLAN_GATED',
    gates: ['sexual_health_addon'],
    sensitive: true,
    anonymousAllowed: true,
    sections: [
      ...sexualCommon,
      { title:'Female-Specific', questions: [
        { label:'Menstrual cycle regularity', type:'SINGLE_CHOICE', options:['Regular','Irregular','No periods'] },
        { label:'Pregnancy planning', type:'SINGLE_CHOICE', options:['No','Yes'] },
        { label:'Vaginal symptoms (pain, discharge)', type:'SINGLE_CHOICE', options:['No','Yes'] },
      ]}
    ]
  });

  await upsertForm({
    slug: 'sexual-health-male',
    title: 'Sexual Health — Male',
    category: 'Sexual Health',
    visibility: 'PLAN_GATED',
    gates: ['sexual_health_addon'],
    sensitive: true,
    anonymousAllowed: true,
    sections: [
      ...sexualCommon,
      { title:'Male-Specific', questions: [
        { label:'Night/morning erections changed?', type:'SINGLE_CHOICE', options:['No','Yes'] },
        { label:'Libido / fantasies changed?', type:'SINGLE_CHOICE', options:['No','Yes'] },
        { label:'Muscle mass loss?', type:'SINGLE_CHOICE', options:['No','Yes'] },
        { label:'Body hair changes (legs, arms, chest, back, face)', type:'SINGLE_CHOICE', options:['No','Less','More'] },
        { label:'Notes', type:'TEXTAREA' },
      ]}
    ]
  });

  console.log('Seeded: patient-questionnaire, mental-health, sexual-health-{general,female,male}');
}

run().finally(()=>prisma.$disconnect());
