const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function upsertForm(def){
  const existing = await prisma.form.findUnique({ where:{ slug:def.slug }, select:{ id:true }});
  const form = existing
    ? await prisma.form.update({ where:{ slug:def.slug }, data:{ title:def.title, category:def.category, visibility:def.visibility||"PUBLIC", gates:def.gates||[], sensitive:!!def.sensitive, anonymousAllowed:!!def.anonymousAllowed }})
    : await prisma.form.create({ data:{ slug:def.slug, title:def.title, category:def.category, visibility:def.visibility||"PUBLIC", gates:def.gates||[], sensitive:!!def.sensitive, anonymousAllowed:!!def.anonymousAllowed }});
  await prisma.formSection.deleteMany({ where:{ formId: form.id }});
  let order = 0;
  for(const s of def.sections){
    const sec = await prisma.formSection.create({ data:{ formId: form.id, title: s.title, order: order++ }});
    let qorder = 0;
    for(const q of s.questions){
      await prisma.question.create({ data:{
        sectionId: sec.id,
        label: q.label,
        type: q.type, // только: TEXT, TEXTAREA, NUMBER, DATE, BOOLEAN, SINGLE_CHOICE, MULTI_CHOICE
        required: !!q.required,
        sensitivity: q.sensitivity || "NONE",
        order: qorder++,
        options: q.options || null
      }});
    }
  }
}

async function run(){
  await upsertForm({
    slug: "patient-questionnaire",
    title: "Patient Questionnaire",
    category: "General",
    sections: [
      {
        title: "General Personal Information",
        questions: [
          { label:"Full Name", type:"TEXT", required:true },
          { label:"Date of Birth", type:"DATE", required:true },
          { label:"Gender", type:"SINGLE_CHOICE", options:["Male","Female","Other"] },
          { label:"Phone Number", type:"TEXT" },
          { label:"Country", type:"TEXT" },
        ],
      },
      {
        title: "Lifestyle",
        questions: [
          { label:"Sleep hours (avg)", type:"NUMBER" },
          { label:"Physical activity", type:"SINGLE_CHOICE", options:["Low","Moderate","High"] },
          { label:"Smoking", type:"BOOLEAN" },
          { label:"Alcohol", type:"SINGLE_CHOICE", options:["Never","Sometimes","Often"] },
          { label:"Diet notes", type:"TEXTAREA" },
        ],
      },
      {
        title: "Goals",
        questions: [
          { label:"Primary health goals", type:"TEXTAREA" },
          { label:"Obstacles", type:"TEXTAREA" },
        ],
      },
    ],
  });

  await upsertForm({
    slug: "medical-profile",
    title: "Medical Profile",
    category: "Medical",
    sections:[
      { title:"Conditions", questions:[
        { label:"Active conditions", type:"MULTI_CHOICE", options:["Hypertension","Diabetes","Asthma","Depression","Anxiety","None"] },
        { label:"Other conditions (free text)", type:"TEXTAREA" },
      ]},
      { title:"Medications & Supplements", questions:[
        { label:"Current prescription meds", type:"TEXTAREA" },
        { label:"Supplements", type:"TEXTAREA" },
      ]},
    ]
  });

  await upsertForm({
    slug: "general-wellness",
    title: "General Wellness",
    category: "General",
    sections:[
      { title:"Profile Basics", questions:[
        { label:"Age group", type:"SINGLE_CHOICE", options:["18–24","25–34","35–44","45–54","55+"] , required:true},
        { label:"Sex at birth", type:"SINGLE_CHOICE", options:["Male","Female"], required:true},
        { label:"Height", type:"NUMBER", required:true },
        { label:"Weight", type:"NUMBER", required:true },
      ]},
      { title:"Vitals & Measurements", questions:[
        { label:"Blood pressure (systolic/diastolic)", type:"TEXT" },
        { label:"Resting heart rate", type:"NUMBER" },
      ]},
    ]
  });

  await upsertForm({
    slug: "mental-health",
    title: "Mental Health Check-In",
    category: "Psychology",
    visibility: "PLAN_GATED",
    gates:["psychology_addon"],
    sections:[
      { title:"Mood & Stress", questions:[
        { label:"Average mood (1–10)", type:"NUMBER", required:true },
        { label:"Stress level (1–10)", type:"NUMBER" },
        { label:"Current concerns", type:"TEXTAREA" },
      ]},
      { title:"Support", questions:[
        { label:"Has social support?", type:"BOOLEAN" },
        { label:"Therapy or counseling now?", type:"BOOLEAN" },
      ]},
    ]
  });

  await upsertForm({
    slug: "sexual-health-general",
    title: "Sexual Health — General",
    category: "Sexual Health",
    visibility:"PLAN_GATED",
    gates:["sexual_addon"],
    sensitive:true,
    sections:[
      { title:"Activity", questions:[
        { label:"Sexually active?", type:"BOOLEAN", required:true },
        { label:"Partners in last 12 months", type:"NUMBER" },
      ]},
      { title:"STIs & Screening", questions:[
        { label:"History of STIs", type:"MULTI_CHOICE", options:["Chlamydia","Gonorrhea","Syphilis","HPV","HSV","HIV","Other","No history"] },
        { label:"Last STI screening (months ago)", type:"NUMBER" },
      ]},
      { title:"Symptoms", questions:[
        { label:"Unusual pain/discharge/lesions", type:"SINGLE_CHOICE", options:["Yes","No"] },
        { label:"Notes", type:"TEXTAREA" },
      ]}
    ]
  });

  await upsertForm({
    slug: "sexual-health-female",
    title: "Sexual Health — Female",
    category: "Sexual Health",
    visibility:"PLAN_GATED",
    gates:["sexual_addon"],
    sensitive:true,
    sections:[
      { title:"Cycle & Hormones", questions:[
        { label:"Menstrual cycle regular?", type:"SINGLE_CHOICE", options:["Yes","No","Perimenopause","Menopause"] },
        { label:"Contraception", type:"SINGLE_CHOICE", options:["None","Pill","IUD","Implant","Other"] },
      ]},
      { title:"Symptoms", questions:[
        { label:"Pain, discharge, itching", type:"SINGLE_CHOICE", options:["Yes","No"] },
        { label:"Notes", type:"TEXTAREA" },
      ]},
    ]
  });

  await upsertForm({
    slug: "sexual-health-male",
    title: "Sexual Health — Male",
    category: "Sexual Health",
    visibility:"PLAN_GATED",
    gates:["sexual_addon"],
    sensitive:true,
    sections:[
      { title:"Hormones & Function", questions:[
        { label:"Morning erections changed?", type:"SINGLE_CHOICE", options:["No change","Less frequent","None"] },
        { label:"Sexual desire changed?", type:"SINGLE_CHOICE", options:["No change","Lower","Higher"] },
      ]},
      { title:"Symptoms", questions:[
        { label:"Penile pain/discharge/lesions", type:"SINGLE_CHOICE", options:["Yes","No"] },
        { label:"Testicular pain/swelling", type:"SINGLE_CHOICE", options:["Yes","No"] },
      ]},
    ]
  });

  console.log("Seeded standard forms.");
}

run().finally(()=>prisma.$disconnect());
