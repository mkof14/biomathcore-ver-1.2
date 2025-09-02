export type QType = "TEXT" | "TEXTAREA" | "NUMBER" | "DATE" | "BOOLEAN" | "SINGLE_CHOICE" | "MULTI_CHOICE" | "SCALE_0_3";
export type Question = {
  id: string;
  label: string;
  type: QType;
  required?: boolean;
  options?: string[];
  gate?: "psychology" | "sexual";
  note?: string;
};
export type Section = { id: string; title: string; questions: Question[] };
export type FormDef = {
  slug: string;
  title: string;
  category?: string;
  sensitive?: boolean;
  sections: Section[];
};

const SCALE_0_3 = ["0 — Not at all","1 — Several days","2 — More than half the days","3 — Nearly every day"];

export const FORMS: FormDef[] = [
  /* ===== Patient Questionnaire (основа) ===== */
  {
    slug: "patient",
    title: "Patient Questionnaire",
    sections: [
      {
        id: "about",
        title: "General Information",
        questions: [
          { id: "gender", label: "Gender", type: "SINGLE_CHOICE", required: true, options:["Female","Male","Non-binary","Prefer not to say"] },
          { id: "age", label: "Age", type: "NUMBER", required: true },
          { id: "height", label: "Height", type: "NUMBER", required: true, note: "Metric/Imperial supported" },
          { id: "weight", label: "Weight", type: "NUMBER", required: true, note: "Metric/Imperial supported" },
          { id: "marital", label: "Marital status", type: "SINGLE_CHOICE", options:["Single","Married/Partner","Divorced","Widowed"] },
          { id: "education", label: "Education level", type: "SINGLE_CHOICE", options:["High school","College","Bachelor","Master","PhD","Other"] },
          { id: "occupation", label: "Occupation", type: "TEXT" },
          { id: "timezone", label: "Time zone", type: "TEXT" },
        ]
      },
      {
        id: "genetics",
        title: "Genetic & Family History",
        questions: [
          { id: "fam_chronic", label: "Family history of chronic diseases (obesity, diabetes, hypertension, cancer)", type: "MULTI_CHOICE",
            options:["Obesity","Diabetes","Hypertension","Cancer","None","Other"] },
          { id: "fam_mental", label: "Family history of mental health disorders", type: "SINGLE_CHOICE", options:["Yes","No","Unsure"] },
          { id: "known_mut", label: "Known genetic variants/mutations", type: "TEXTAREA" },
          { id: "surgeries", label: "Past surgeries (what/when)", type: "TEXTAREA" },
        ]
      },
      {
        id: "lifestyle",
        title: "Lifestyle & Habits",
        questions: [
          { id: "sleep_hours", label: "Sleep hours (avg)", type: "NUMBER" },
          { id: "stress_freq", label: "Stress frequency", type: "SINGLE_CHOICE",
            options:["Rarely","Sometimes","Often","Constantly"] },
          { id: "stress_coping", label: "How do you cope with stress?", type: "TEXTAREA" },
          { id: "activity", label: "Regular physical activity (type & frequency)", type: "TEXTAREA" },
          { id: "diet", label: "Diet pattern", type: "SINGLE_CHOICE",
            options:["Balanced","Low-carb","Vegetarian/Vegan","Intermittent fasting","Other"] },
          { id: "alcohol", label: "Alcohol use", type: "SINGLE_CHOICE", options:["No","Occasional","Weekly","Daily"] },
          { id: "smoking", label: "Smoking", type: "SINGLE_CHOICE", options:["Never","Former","Current"] },
          { id: "recreational", label: "Recreational substances", type: "SINGLE_CHOICE", options:["No","Sometimes","Regularly"] },
          { id: "screen_time", label: "Screen time per day (hours)", type: "NUMBER" },
          { id: "hobbies", label: "Hobbies that help you relax", type: "TEXTAREA" },
        ]
      },
      {
        id: "meds",
        title: "Medications & Supplements",
        questions: [
          { id: "rx", label: "Prescription meds (name, dose, frequency)", type: "TEXTAREA" },
          { id: "supp", label: "Supplements/vitamins", type: "TEXTAREA" },
          { id: "drug_allergy", label: "Drug allergies", type: "TEXTAREA" },
          { id: "side_effects", label: "Past adverse reactions", type: "TEXTAREA" },
        ]
      },
      {
        id: "mental",
        title: "Emotional & Mental Health",
        questions: [
          { id: "mood_now", label: "Current emotional state", type: "SINGLE_CHOICE", options:["Calm","Balanced","Anxious","Low/Depressed","Irritable"] },
          { id: "mood_swings", label: "Mood swings", type: "SINGLE_CHOICE", options:["No","Sometimes","Often"] },
          { id: "mh_conditions", label: "Anxiety, depression, other (free text)", type: "TEXTAREA" },
          { id: "therapy", label: "Therapy/coaching now?", type: "SINGLE_CHOICE", options:["Yes","No"] },
          { id: "support", label: "Support network available?", type: "SINGLE_CHOICE", options:["Yes","No","Limited"] },
        ]
      },
      {
        id: "environment",
        title: "Environment & Exposure",
        questions: [
          { id: "living_area", label: "Where do you live", type: "SINGLE_CHOICE", options:["City","Suburbs","Rural"] },
          { id: "pollution", label: "Nearby industrial areas/air pollution", type: "SINGLE_CHOICE", options:["Yes","No","Unsure"] },
          { id: "filters", label: "Water/air filters at home", type: "SINGLE_CHOICE", options:["Yes","No"] },
          { id: "pets", label: "Pets at home", type: "SINGLE_CHOICE", options:["Yes","No"] },
          { id: "nature", label: "Time in nature (per week)", type: "NUMBER" },
        ]
      },
      {
        id: "tech",
        title: "Tech & Devices",
        questions: [
          { id: "wearables", label: "Wearables (watch, sleep tracker etc.)", type: "SINGLE_CHOICE", options:["Yes","No"] },
          { id: "health_apps", label: "Health/Fitness apps used", type: "TEXTAREA" },
          { id: "share_data", label: "Ready to share device/app data with BioMath Core?", type: "SINGLE_CHOICE", options:["Yes","No","Maybe later"] },
        ]
      },
      {
        id: "goals",
        title: "Goals & Motivation",
        questions: [
          { id: "goals", label: "Your health goals (short description)", type: "TEXTAREA" },
          { id: "wellness_mean", label: "What “wellness” means to you", type: "TEXTAREA" },
          { id: "3mo_changes", label: "Changes you’re ready to try in 3 months", type: "TEXTAREA" },
          { id: "obstacles", label: "What blocks your progress?", type: "TEXTAREA" },
        ]
      },
      {
        id: "prefs",
        title: "Preferences & Privacy",
        questions: [
          { id: "neurodiv", label: "Specific traits (sensory sensitivity, ADHD, autism)", type: "TEXTAREA" },
          { id: "info_format", label: "Preferred info format", type: "SINGLE_CHOICE", options:["Text","Video","Visual dashboards"] },
          { id: "data_share", label: "What data are you comfortable sharing?", type: "TEXTAREA" },
          { id: "security", label: "Digital security concerns", type: "TEXTAREA" },
          { id: "tone", label: "Preferred tone/style/frequency of comms", type: "TEXTAREA" },
        ]
      },
    ]
  },

  /* ===== Клинические шкалы ===== */
  {
    slug: "phq-9",
    title: "Mood Check (9 questions)",
    category: "Clinical scale",
    sections: [
      {
        id: "phq",
        title: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
        questions: [
          { id:"phq1", label:"Little interest or pleasure in doing things", type:"SCALE_0_3" },
          { id:"phq2", label:"Feeling down, depressed, or hopeless", type:"SCALE_0_3" },
          { id:"phq3", label:"Trouble falling or staying asleep, or sleeping too much", type:"SCALE_0_3" },
          { id:"phq4", label:"Feeling tired or having little energy", type:"SCALE_0_3" },
          { id:"phq5", label:"Poor appetite or overeating", type:"SCALE_0_3" },
          { id:"phq6", label:"Feeling bad about yourself — or that you’re a failure", type:"SCALE_0_3" },
          { id:"phq7", label:"Trouble concentrating on things", type:"SCALE_0_3" },
          { id:"phq8", label:"Moving/speaking slowly or being fidgety or restless", type:"SCALE_0_3" },
          { id:"phq9", label:"Thoughts that you would be better off dead, or hurting yourself", type:"SCALE_0_3" },
        ]
      }
    ]
  },
  {
    slug: "gad-7",
    title: "Anxiety Check (7 questions)",
    category: "Clinical scale",
    sections: [
      {
        id:"gad",
        title:"Over the last 2 weeks, how often have you been bothered by the following problems?",
        questions: [
          { id:"gad1", label:"Feeling nervous, anxious or on edge", type:"SCALE_0_3" },
          { id:"gad2", label:"Not being able to stop or control worrying", type:"SCALE_0_3" },
          { id:"gad3", label:"Worrying too much about different things", type:"SCALE_0_3" },
          { id:"gad4", label:"Trouble relaxing", type:"SCALE_0_3" },
          { id:"gad5", label:"Being so restless that it is hard to sit still", type:"SCALE_0_3" },
          { id:"gad6", label:"Becoming easily annoyed or irritable", type:"SCALE_0_3" },
          { id:"gad7", label:"Feeling afraid as if something awful might happen", type:"SCALE_0_3" },
        ]
      }
    ]
  },

  /* ===== Senior 55+ (упрощённая версия) ===== */
  {
    slug: "senior-55",
    title: "Senior (55+) Intake",
    category: "Accessible flow",
    sections: [
      { id:"about", title:"About You", questions:[
        { id:"age", label:"Age", type:"NUMBER", required:true },
        { id:"living", label:"Where do you live?", type:"SINGLE_CHOICE", options:["Alone","With family","With partner","Care facility"] },
      ]},
      { id:"activity", title:"Daily Activity", questions:[
        { id:"walks", label:"Walks per week", type:"NUMBER" },
        { id:"sleep", label:"Sleep hours", type:"NUMBER" },
        { id:"hobbies", label:"Hobbies/joyful activities", type:"TEXTAREA" },
      ]},
      { id:"meds", title:"Medications & Allergies", questions:[
        { id:"meds", label:"Current meds", type:"TEXTAREA" },
        { id:"allergies", label:"Drug allergies", type:"TEXTAREA" },
      ]},
      { id:"mood", title:"Mood & Wellbeing", questions:[
        { id:"feeling", label:"How do you feel lately?", type:"SINGLE_CHOICE", options:["Energetic","Tired","Anxious","Calm","Sad"] },
        { id:"talk", label:"Have someone to talk to when it’s hard?", type:"SINGLE_CHOICE", options:["Yes","No","Sometimes"] },
      ]},
      { id:"tech", title:"Technology", questions:[
        { id:"smartphone", label:"Do you use a smartphone/tablet?", type:"SINGLE_CHOICE", options:["Yes","No"] },
        { id:"reminders", label:"Want health reminders via phone?", type:"SINGLE_CHOICE", options:["Yes","No","Maybe"] },
      ]},
      { id:"goals", title:"Goals", questions:[
        { id:"goals", label:"What would you like to improve first?", type:"TEXTAREA" },
      ]},
    ]
  },

  /* ===== Sensitive (по прямой ссылке) ===== */
  {
    slug: "sexual-health-general",
    title: "Sexual Health — General",
    sensitive: true,
    sections: [
      { id: "activity", title: "Activity", questions: [
        { id: "libido", label: "Changes in sexual thoughts/fantasies", type:"SINGLE_CHOICE", options:["No change","Decreased","Increased"] },
        { id: "frequency", label: "Frequency of sexual intercourse", type:"SINGLE_CHOICE", options:["<1/mo","1–3/mo","1–2/wk","3+/wk"] },
      ]},
      { id: "screening", title: "STIs & Screening", questions: [
        { id: "stis", label: "History of STIs", type:"MULTI_CHOICE", options:["Chlamydia","Gonorrhea","Syphilis","HPV","HSV","HIV","Other","No history"] },
        { id: "last_screen", label: "Last screening (months ago)", type:"NUMBER" },
      ]},
    ]
  },
  {
    slug: "sexual-health-female",
    title: "Sexual Health — Female",
    sensitive: true,
    sections: [
      { id: "cycle", title:"Cycle & Hormones", questions:[
        { id: "cycle_reg", label:"Cycle regularity", type:"SINGLE_CHOICE", options:["Regular","Irregular","No cycle"] },
        { id: "libido_f", label:"Libido changes", type:"SINGLE_CHOICE", options:["No change","Decreased","Increased"] },
      ]},
    ]
  },
  {
    slug: "sexual-health-male",
    title: "Sexual Health — Male",
    sensitive: true,
    sections: [
      { id: "horm", title:"Hormones & Function", questions:[
        { id: "noct_erection", label:"Night/morning erections — changes", type:"SINGLE_CHOICE", options:["No change","Decreased","Increased"] },
        { id: "hair_density", label:"Hair density changes (legs/arms)", type:"SINGLE_CHOICE", options:["No change","Less","More"] },
      ]},
    ]
  },
];

export function visibleFormsForUser(all: FormDef[]) {
  return all.filter(f => !f.sensitive);
}
export function getFormBySlug(slug: string) {
  return FORMS.find(f => f.slug === slug);
}
