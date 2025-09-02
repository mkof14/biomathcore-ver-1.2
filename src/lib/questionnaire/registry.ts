export type QOption = { value: string; label: string };
export type QBase = {
  id: string;
  type: "text"|"number"|"date"|"boolean"|"single"|"multi"|"scale";
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  allowPreferNotToSay?: boolean;
  isSensitive?: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: QOption[];
};
export type QSection = { id: string; title: string; description?: string; questions: QBase[] };
export type QSchema = {
  id: string; version: number; title: string; description?: string;
  sections: QSection[];
  logicRules?: Array<{ when: { questionId: string; operator: "equals"|"notEquals"|"lt"|"gt"|"in"|"notIn"; value: any }, then: { hideQuestionIds?: string[] } }>;
};

export const QUESTIONNAIRE_REGISTRY: Record<string, QSchema> = {
  "core-profile": {
    id: "core-profile",
    version: 1,
    title: "Core Profile",
    description: "Key profile and goals.",
    sections: [
      {
        id: "profile",
        title: "Profile",
        questions: [
          { id: "dob", type: "date", label: "Date of birth", required: true },
          { id: "sex_at_birth", type: "single", label: "Sex at birth", required: true, options: [
            { value: "female", label: "Female" }, { value: "male", label: "Male" }, { value: "intersex", label: "Intersex" }
          ], allowPreferNotToSay: true },
          { id: "gender_identity", type: "single", label: "Gender identity (optional)", options: [
            { value: "woman", label: "Woman" }, { value: "man", label: "Man" }, { value: "nonbinary", label: "Non-binary" }, { value: "other", label: "Other" }
          ], allowPreferNotToSay: true }
        ]
      },
      {
        id: "measurements",
        title: "Measurements",
        description: "Choose units and enter values. You can skip anything you're not sure about.",
        questions: [
          { id: "weight_unit", type: "single", label: "Weight — units", options: [
            { value: "kg", label: "kg" }, { value: "lb", label: "lb" }
          ]},
          { id: "weight_value", type: "number", label: "Weight — value", placeholder: "Enter your weight", min: 20, max: 400 },

          { id: "height_unit", type: "single", label: "Height — units", options: [
            { value: "cm", label: "cm" }, { value: "in", label: "in" }
          ]},
          { id: "height_value", type: "number", label: "Height — value", placeholder: "Enter your height", min: 80, max: 260 },

          { id: "waist_unit", type: "single", label: "Waist — units", options: [
            { value: "cm", label: "cm" }, { value: "in", label: "in" }
          ]},
          { id: "waist_value", type: "number", label: "Waist — value", placeholder: "Optional", min: 40, max: 200 }
        ]
      },
      {
        id: "goals",
        title: "Goals",
        questions: [
          { id: "top_goals", type: "multi", label: "Your top goals", options: [
            { value: "sleep", label: "Sleep" },
            { value: "stress", label: "Stress" },
            { value: "weight", label: "Weight" },
            { value: "endurance", label: "Endurance" },
            { value: "mood",  label: "Mood" }
          ]},
          { id: "notes", type: "text", label: "Anything you'd like us to know?", placeholder: "Optional" }
        ]
      },
      {
        id: "quick_scales",
        title: "Quick scales",
        questions: [
          { id: "energy_10", type: "scale", label: "Energy today", min: 0, max: 10, step: 1 },
          { id: "mood_10",   type: "scale", label: "Mood today",   min: 0, max: 10, step: 1 },
          { id: "sleep_10",  type: "scale", label: "Sleep quality (last night)", min: 0, max: 10, step: 1 }
        ]
      }
    ],
    logicRules: [
      { when: { questionId: "top_goals", operator: "in", value: ["weight"] }, then: { hideQuestionIds: [] } },
      { when: { questionId: "top_goals", operator: "notIn", value: ["weight"] }, then: { hideQuestionIds: ["waist_unit","waist_value"] } }
    ]
  },

  "body-composition": {
    id: "body-composition",
    version: 1,
    title: "Body Composition",
    description: "Optional measurements for weight management and cardio-metabolic services.",
    sections: [
      {
        id: "primary",
        title: "Circumferences",
        description: "Select units and enter values. Skip anything you prefer not to share.",
        questions: [
          { id: "waist_unit", type: "single", label: "Waist — units", options: [
            { value: "cm", label: "cm" }, { value: "in", label: "in" }
          ]},
          { id: "waist_value", type: "number", label: "Waist — value", placeholder: "Optional", min: 40, max: 200 },

          { id: "hip_unit", type: "single", label: "Hip — units", options: [
            { value: "cm", label: "cm" }, { value: "in", label: "in" }
          ]},
          { id: "hip_value", type: "number", label: "Hip — value", placeholder: "Optional", min: 40, max: 200 },

          { id: "neck_unit", type: "single", label: "Neck — units", options: [
            { value: "cm", label: "cm" }, { value: "in", label: "in" }
          ]},
          { id: "neck_value", type: "number", label: "Neck — value", placeholder: "Optional", min: 20, max: 70 }
        ]
      },
      {
        id: "context",
        title: "Context (optional)",
        questions: [
          { id: "method", type: "single", label: "Body fat assessment method (if any)", options: [
            { value: "none", label: "None" }, { value: "calipers", label: "Calipers" }, { value: "bia", label: "BIA scale" }, { value: "dexascan", label: "DEXA" }
          ], allowPreferNotToSay: true },
          { id: "notes", type: "text", label: "Notes", placeholder: "Optional comments" }
        ]
      }
    ]
  },

  "sexual-health-core": {
    id: "sexual-health-core",
    version: 1,
    title: "Sexual Health — Core",
    description: "General topics. You can skip any question.",
    sections: [
      {
        id: "sh_core",
        title: "General",
        questions: [
          { id: "libido", type: "scale", label: "Current libido (0–10)", isSensitive: true, min: 0, max: 10, step: 1 },
          { id: "fantasies_freq_change", type: "scale", label: "Changes in frequency of sexual thoughts/fantasies (last 3 months)", isSensitive: true, min: 0, max: 4, step: 1 },
          { id: "sex_satisfaction", type: "single", label: "Satisfaction with sexual life", isSensitive: true, options: [
            { value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }
          ], allowPreferNotToSay: true }
        ]
      }
    ]
  },

  "sexual-health-men": {
    id: "sexual-health-men",
    version: 1,
    title: "Sexual Health — Men",
    sections: [
      {
        id: "men_function",
        title: "Erection & Function",
        questions: [
          { id: "nocturnal_morning_erections_change", type: "scale", label: "Changes in frequency of night/morning erections", isSensitive: true, min: 0, max: 4, step: 1 },
          { id: "erection_quality", type: "single", label: "Erection quality", isSensitive: true, options: [
            { value: "insufficient", label: "Insufficient" }, { value: "adequate", label: "Adequate" }, { value: "stable_good", label: "Stable good" }
          ]},
          { id: "sex_intercourse_frequency_change", type: "scale", label: "Changes in frequency of sexual intercourse", isSensitive: true, min: 0, max: 4, step: 1 }
        ]
      },
      {
        id: "men_anabolic_signs",
        title: "Body changes",
        questions: [
          { id: "muscle_mass_loss", type: "scale", label: "Changes or loss of muscle mass", isSensitive: true, min: 0, max: 4, step: 1 },
          { id: "hair_presence_density", type: "multi", label: "Hair presence/density: select areas with changes", isSensitive: true, options: [
            { value: "legs_presence", label: "Legs — presence" },
            { value: "hands_presence", label: "Hands — presence" },
            { value: "chest_presence", label: "Chest — presence" },
            { value: "back_presence", label: "Back — presence" },
            { value: "face_presence", label: "Face — presence" },
            { value: "legs_density", label: "Legs — density" },
            { value: "hands_density", label: "Hands — density" }
          ], allowPreferNotToSay: true }
        ]
      }
    ]
  },

  "sexual-health-women": {
    id: "sexual-health-women",
    version: 1,
    title: "Sexual Health — Women",
    sections: [
      {
        id: "cycle",
        title: "Menstrual cycle",
        questions: [
          { id: "cycle_regular", type: "single", label: "Cycle regularity", isSensitive: true, options: [
            { value: "regular", label: "Regular" }, { value: "irregular", label: "Irregular" }, { value: "menopause", label: "Menopause" }
          ], allowPreferNotToSay: true },
          { id: "pms_severity", type: "scale", label: "PMS severity", isSensitive: true, min: 0, max: 10, step: 1 }
        ]
      },
      {
        id: "comfort",
        title: "Comfort",
        questions: [
          { id: "vaginal_dryness", type: "single", label: "Vaginal dryness/discomfort", isSensitive: true, options: [
            { value: "no", label: "No" }, { value: "mild", label: "Mild" }, { value: "moderate", label: "Moderate" }, { value: "severe", label: "Severe" }
          ], allowPreferNotToSay: true }
        ]
      }
    ]
  }
};
