const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function upsertForm(data){
  return prisma.form.upsert({
    where: { slug: data.slug },
    update: {
      title: data.title, category: data.category,
      visibility: data.visibility || "PUBLIC",
      gates: data.gates || [],
      anonymousAllowed: !!data.anonymousAllowed,
      sections: {
        deleteMany: {},
        create: (data.sections||[]).map((s, si)=>({
          title: s.title, order: si,
          questions: {
            create: (s.questions||[]).map((q, qi)=>({
              label: q.label, type: q.type, required: !!q.required,
              options: q.options || [], order: qi
            }))
          }
        }))
      }
    },
    create: {
      slug: data.slug, title: data.title, category: data.category,
      visibility: data.visibility || "PUBLIC",
      gates: data.gates || [],
      anonymousAllowed: !!data.anonymousAllowed,
      sections: {
        create: (data.sections||[]).map((s, si)=>({
          title: s.title, order: si,
          questions: {
            create: (s.questions||[]).map((q, qi)=>({
              label: q.label, type: q.type, required: !!q.required,
              options: q.options || [], order: qi
            }))
          }
        }))
      }
    }
  });
}

async function run(){

  // 1) Senior Profile (55+)
  await upsertForm({
    slug: "senior-profile",
    title: "Senior Profile (55+)",
    category: "Seniors",
    sections: [
      { title: "About You", questions: [
        { label:"Age", type:"NUMBER", required:true },
        { label:"Sex", type:"SINGLE_CHOICE", options:["Male","Female","Prefer not to say"], required:true },
        { label:"Where do you live?", type:"SINGLE_CHOICE", options:["City","Suburbs","Rural"] },
        { label:"Who do you live with?", type:"SINGLE_CHOICE", options:["Alone","With family","With partner","Care facility"] },
      ]},
      { title: "Daily Activity", questions: [
        { label:"Walks outdoors (times/week)", type:"NUMBER" },
        { label:"Any physical activity (e.g., stretching, garden)?", type:"BOOLEAN" },
        { label:"Sleep hours (usual)", type:"NUMBER" },
        { label:"Hobbies that bring joy", type:"TEXTAREA" },
      ]},
      { title: "Medications & Supplements", questions: [
        { label:"Any medications?", type:"BOOLEAN" },
        { label:"Allergies to medications?", type:"BOOLEAN" },
        { label:"Vitamins or supplements used?", type:"BOOLEAN" },
      ]},
      { title: "Mood & Well-being", questions: [
        { label:"How have you felt lately?", type:"SINGLE_CHOICE", options:["Energetic","Tired","Anxious","Calm"] },
        { label:"Do you experience sadness or anxiety?", type:"BOOLEAN" },
        { label:"Is there someone to talk to when it's hard?", type:"BOOLEAN" },
      ]},
      { title: "Technology", questions: [
        { label:"Do you have a smartphone or tablet?", type:"BOOLEAN" },
        { label:"Do you use health or communication apps?", type:"BOOLEAN" },
        { label:"Would you like health reminders on phone?", type:"BOOLEAN" },
      ]},
      { title: "Goals", questions: [
        { label:"What would you like to improve?", type:"MULTI_CHOICE", options:["More energy","Better sleep","Less pain","Be more active","Other"] },
        { label:"Ready to try new habits?", type:"BOOLEAN" },
      ]},
    ]
  });

  // 2) Chronic Condition — Daily Check-In (с рейтинговыми шкалами)
  await upsertForm({
    slug: "chronic-daily-checkin",
    title: "Chronic Condition — Daily Check-In",
    category: "Chronic",
    sections: [
      { title: "How do you feel today?", questions: [
        { label:"Mood (1–10)", type:"RATING_1_10", required:true },
        { label:"Energy (1–10)", type:"RATING_1_10" },
        { label:"Sleep quality (1–10)", type:"RATING_1_10" },
        { label:"Pain (1–10)", type:"RATING_1_10" },
        { label:"Anxiety last 2 weeks (1–10)", type:"RATING_1_10" },
      ]},
      { title: "Devices & Tracking", questions: [
        { label:"Devices used for monitoring", type:"MULTI_CHOICE", options:["Sleep tracker","BP monitor","Glucometer","None"] },
      ]},
      { title: "Notes & Support", questions: [
        { label:"Anything to note today", type:"TEXTAREA" },
      ]},
    ]
  });

  // 3) Goals Planner — персональные цели/барьеры/поддержка
  await upsertForm({
    slug: "goals-planner",
    title: "Health Goals Planner",
    category: "Goals",
    sections: [
      { title:"Your Primary Goals", questions:[
        { label:"Main goals for next 3 months", type:"TEXTAREA", required:true },
        { label:"Focus areas", type:"MULTI_CHOICE", options:["Weight","Sleep","Energy","Stress","Activity","Nutrition","Other"] },
      ]},
      { title:"Barriers & Support", questions:[
        { label:"What blocks your progress?", type:"MULTI_CHOICE", options:["Time","Motivation","Support","Finances","Knowledge","Other"] },
        { label:"Who can support you?", type:"TEXTAREA" },
      ]},
      { title:"Action Plan", questions:[
        { label:"Small actions to start this week", type:"TEXTAREA" },
        { label:"How will you track progress?", type:"TEXTAREA" },
      ]}
    ]
  });

  console.log("Seeded extended forms: senior-profile, chronic-daily-checkin, goals-planner");
}

run().finally(()=>prisma.$disconnect());
