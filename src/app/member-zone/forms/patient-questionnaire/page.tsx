"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

/** ---- минимальные утилиты UI ---- */

function Section({
  title,
  icon,
  children,
  tone = "neutral",
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
  tone?: "neutral" | "mint" | "lemon" | "blush";
}) {
  const tones: Record<string, string> = {
    neutral:
      "bg-neutral-50 border border-neutral-200 shadow-sm",
    mint:
      "bg-emerald-50/60 border border-emerald-200/60 shadow-sm",
    lemon:
      "bg-amber-50/70 border border-amber-200/70 shadow-sm",
    blush:
      "bg-fuchsia-50/60 border border-fuchsia-200/60 shadow-sm",
  };
  return (
    <div className={`rounded-2xl p-5 md:p-6 ${tones[tone]}`}>
      <div className="mb-4 flex items-center gap-2">
        {icon && <span className="text-xl">{icon}</span>}
        <h3 className="text-lg md:text-xl font-semibold text-neutral-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Label({ children, required=false }: {children: React.ReactNode; required?: boolean}) {
  return (
    <div className="text-sm font-medium text-neutral-800 mb-1.5">
      {children} {required && <span className="text-rose-600">*</span>}
    </div>
  );
}

const baseInput =
  "w-full rounded-lg bg-white text-neutral-900 placeholder-neutral-400 " +
  "border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-violet-400/70 " +
  "px-3 py-2.5 transition";

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${baseInput} ${props.className ?? ""}`} />;
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${baseInput} min-h-[92px] ${props.className ?? ""}`} />;
}
function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${baseInput} pr-9 ${props.className ?? ""}`}>
      {props.children}
    </select>
  );
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-lg border border-neutral-300 bg-white overflow-hidden">
      {options.map((o, i) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={
              "px-3.5 py-1.5 text-sm " +
              (active
                ? "bg-violet-600 text-white"
                : "bg-white text-neutral-800 hover:bg-neutral-50")
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-3 py-1.5 rounded-md text-sm border transition " +
        (active
          ? "bg-violet-600 border-violet-600 text-white"
          : "bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50")
      }
    >
      {children}
    </button>
  );
}

/** ---- конвертация единиц ---- */

function cmToFtIn(cm: number) {
  const totalIn = cm / 2.54;
  const ft = Math.floor(totalIn / 12);
  const inch = Math.round(totalIn - ft * 12);
  return { ft, inch };
}
function ftInToCm(ft: number, inch: number) {
  return Math.round((ft * 12 + inch) * 2.54);
}
function kgToLb(kg: number) {
  return Math.round(kg * 2.20462);
}
function lbToKg(lb: number) {
  return Math.round(lb / 2.20462);
}

/** ---- страница анкеты ---- */

type Units = "metric" | "imperial";

export default function PatientQuestionnaire() {
  const router = useRouter();
  const params = useSearchParams();
  const initialUnits: Units = (params.get("units") as Units) ?? "metric";

  const [units, setUnits] = useState<Units>(initialUnits);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
  const [banner, setBanner] = useState<string | null>(null);

  // Данные формы (минимально необходимое + остальное)
  const [data, setData] = useState<Record<string, any>>({
    // required core:
    ageGroup: "",
    sexAtBirth: "",
    height_cm: "",      // если metric
    height_ft: "",      // если imperial
    height_in: "",
    weight_kg: "",
    weight_lb: "",
    primaryGoal: "",
    // прочее:
    marital: "", education: "", occupation: "",
    timezone: "",
    famHistory: [] as string[],
    psychFamily: "", geneticNotes: "",
    sleepHours: "", stressLevel: 5, stressCoping: "",
    activity: [] as string[], diet: "", alcohol: "", smoking: "", smokingYears: "", cigsPerDay: "",
    recSubstances: "", screenTime: "",
    hobbies: "",
    meds: "", supps: "", drugAllergy: "", drugSideEffects: "",
    moodNow: "", moodSwings: "", anxiety: "", depression: "", therapy: "", socialSupport: "",
    areaType: "", pollution: [] as string[], hasFilters: "", pets: "", natureFreq: "",
    wearables: [] as string[], healthApps: "", shareConsent: "",
    goals: "", wellnessMeaning: "", next3months: "", blockers: "",
    neuro: [] as string[], preferFormat: [] as string[],
    privacyShare: [] as string[], securityConcerns: "", commPrefs: "",
    surgeries: "",
  });

  /** --- required поля для прогресса --- */
  const requiredKeys = useMemo(
    () => ["ageGroup", "sexAtBirth", (units === "metric" ? "height_cm" : "height_ft"), (units === "metric" ? "weight_kg" : "weight_lb"), "primaryGoal"],
    [units]
  );
  const missing = requiredKeys.filter((k) => {
    const v = (data as any)[k];
    return v === "" || v === null || v === undefined;
  });
  const progress = Math.round(((requiredKeys.length - missing.length) / requiredKeys.length) * 100);

  /** --- helpers --- */
  function setField(k: string, v: any) {
    setData((d) => ({ ...d, [k]: v }));
  }
  function toggleInArray(k: string, val: string) {
    setData((d) => {
      const arr = new Set<string>(d[k] ?? []);
      if (arr.has(val)) arr.delete(val);
      else arr.add(val);
      return { ...d, [k]: Array.from(arr) };
    });
  }

  /** --- конвертация при переключении units --- */
  useEffect(() => {
    // при переключении попробуем сконвертировать уже введённые значения
    setData((d) => {
      const nd = { ...d };
      if (units === "imperial" && d.height_cm) {
        const { ft, inch } = cmToFtIn(Number(d.height_cm));
        nd.height_ft = ft || "";
        nd.height_in = inch || "";
      }
      if (units === "metric" && (d.height_ft || d.height_in)) {
        const cm = ftInToCm(Number(d.height_ft || 0), Number(d.height_in || 0));
        nd.height_cm = cm || "";
      }
      if (units === "imperial" && d.weight_kg) nd.weight_lb = kgToLb(Number(d.weight_kg));
      if (units === "metric" && d.weight_lb) nd.weight_kg = lbToKg(Number(d.weight_lb));
      return nd;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

  /** --- сабмит --- */
  async function onSubmit() {
    setSaving("saving");
    try {
      // собираем нормализованные height/weight в метрике
      const height_cm =
        units === "metric"
          ? Number(data.height_cm)
          : ftInToCm(Number(data.height_ft || 0), Number(data.height_in || 0));
      const weight_kg =
        units === "metric" ? Number(data.weight_kg) : lbToKg(Number(data.weight_lb || 0));

      const payload = { ...data, units, height_cm, weight_kg };

      const res = await fetch("/api/patient-questionnaire/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Submit error");

      setBanner("Saved. We'll use this profile to power your analytics and reports.");
      setSaving("saved");
      setTimeout(() => setBanner(null), 5000);
    } catch (e: any) {
      setBanner(e?.message || "Something went wrong");
      setSaving("idle");
    }
  }

  /** --- адаптивные блоки примеры --- */
  const showSmokingDetails = data.smoking === "Yes";
  const showMentalExtras = Number(data.anxiety || 0) >= 7 || Number(data.depression || 0) >= 7;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      {/* top bar */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => router.back()}
          className="text-sm text-violet-700 hover:text-violet-600 underline underline-offset-4"
        >
          ← Back
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-600">Units:</span>
          <Segmented
            value={units}
            onChange={(v) => setUnits(v as Units)}
            options={[
              { value: "metric", label: "Metric" },
              { value: "imperial", label: "Imperial" },
            ]}
          />
        </div>
      </div>

      {/* title + progress */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
          Patient Questionnaire
        </h1>
        <div className="mt-3 h-2 rounded-full bg-neutral-200 overflow-hidden">
          <div
            className="h-full bg-violet-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-neutral-600">{progress}% completed</div>
      </div>

      {banner && (
        <div className="mb-5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 px-4 py-3">
          {banner}
        </div>
      )}

      {/* ---- 1. Общая информация ---- */}
      <Section title="General Information" icon="👤" tone="neutral">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label required>Age group</Label>
            <Select value={data.ageGroup} onChange={(e) => setField("ageGroup", e.target.value)}>
              <option value="">Select…</option>
              <option>18–24</option><option>25–34</option><option>35–44</option>
              <option>45–54</option><option>55–64</option><option>65+</option>
            </Select>
          </div>
          <div>
            <Label required>Sex at birth</Label>
            <Select value={data.sexAtBirth} onChange={(e) => setField("sexAtBirth", e.target.value)}>
              <option value="">Select…</option>
              <option>Female</option><option>Male</option><option>Intersex</option><option>Prefer not to say</option>
            </Select>
          </div>

          {/* height */}
          {units === "metric" ? (
            <div>
              <Label required>Height (cm)</Label>
              <Input
                inputMode="numeric"
                placeholder="e.g., 172"
                value={data.height_cm}
                onChange={(e) => setField("height_cm", e.target.value.replace(/[^\d]/g, ""))}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label required>Height (ft)</Label>
                <Input
                  inputMode="numeric"
                  placeholder="e.g., 5"
                  value={data.height_ft}
                  onChange={(e) => setField("height_ft", e.target.value.replace(/[^\d]/g, ""))}
                />
              </div>
              <div>
                <Label>Height (in)</Label>
                <Input
                  inputMode="numeric"
                  placeholder="e.g., 11"
                  value={data.height_in}
                  onChange={(e) => setField("height_in", e.target.value.replace(/[^\d]/g, ""))}
                />
              </div>
            </div>
          )}

          {/* weight */}
          {units === "metric" ? (
            <div>
              <Label required>Weight (kg)</Label>
              <Input
                inputMode="numeric"
                placeholder="e.g., 68"
                value={data.weight_kg}
                onChange={(e) => setField("weight_kg", e.target.value.replace(/[^\d]/g, ""))}
              />
            </div>
          ) : (
            <div>
              <Label required>Weight (lb)</Label>
              <Input
                inputMode="numeric"
                placeholder="e.g., 150"
                value={data.weight_lb}
                onChange={(e) => setField("weight_lb", e.target.value.replace(/[^\d]/g, ""))}
              />
            </div>
          )}

          <div>
            <Label>Marital status</Label>
            <Select value={data.marital} onChange={(e) => setField("marital", e.target.value)}>
              <option value="">Select…</option>
              <option>Single</option><option>Married / Partner</option><option>Divorced</option><option>Widowed</option>
            </Select>
          </div>
          <div>
            <Label>Education</Label>
            <Select value={data.education} onChange={(e) => setField("education", e.target.value)}>
              <option value="">Select…</option>
              <option>High school</option><option>Bachelor</option><option>Master</option><option>PhD</option><option>Other</option>
            </Select>
          </div>
          <div>
            <Label>Occupation / role</Label>
            <Input placeholder="e.g., Software engineer" value={data.occupation} onChange={(e)=>setField("occupation", e.target.value)} />
          </div>
          <div>
            <Label>Time zone</Label>
            <Input placeholder="e.g., America/Los_Angeles" value={data.timezone} onChange={(e)=>setField("timezone", e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Label required>Primary health goal</Label>
            <Input placeholder="e.g., Lose 10 kg, better sleep, more energy" value={data.primaryGoal} onChange={(e)=>setField("primaryGoal", e.target.value)} />
          </div>
        </div>
      </Section>

      {/* ---- 2. Генетика/наследственность ---- */}
      <div className="mt-5">
        <Section title="Genetic & Family History" icon="🧬" tone="mint">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Family history of chronic conditions</Label>
              <div className="flex flex-wrap gap-2">
                {["Obesity","Diabetes","Hypertension","Cancer","Heart disease","Thyroid","Autoimmune"].map(o=>(
                  <Chip key={o} active={data.famHistory.includes(o)} onClick={()=>toggleInArray("famHistory", o)}>{o}</Chip>
                ))}
                <Chip active={data.famHistory.includes("None")} onClick={()=>toggleInArray("famHistory","None")}>None</Chip>
              </div>
            </div>
            <div>
              <Label>Psychiatric disorders in family</Label>
              <Select value={data.psychFamily} onChange={(e)=>setField("psychFamily", e.target.value)}>
                <option value="">Select…</option>
                <option>Yes</option><option>No</option><option>Unsure</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Known mutations / notes</Label>
              <Textarea placeholder="Optional" value={data.geneticNotes} onChange={(e)=>setField("geneticNotes", e.target.value)} />
            </div>
          </div>
        </Section>
      </div>

      {/* ---- 3. Стиль жизни ---- */}
      <div className="mt-5">
        <Section title="Lifestyle & Habits" icon="🧘" tone="blush">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Average sleep (hours)</Label>
              <Input inputMode="numeric" placeholder="e.g., 7.5" value={data.sleepHours} onChange={(e)=>setField("sleepHours", e.target.value)} />
            </div>
            <div>
              <Label>Stress level (1–10)</Label>
              <Input type="range" min={1} max={10} value={data.stressLevel} onChange={(e)=>setField("stressLevel", e.target.value)} />
              <div className="text-xs text-neutral-600 mt-1">Current: {data.stressLevel}</div>
            </div>
            <div className="md:col-span-2">
              <Label>How do you cope with stress?</Label>
              <Input placeholder="e.g., walking, breathwork, friends" value={data.stressCoping} onChange={(e)=>setField("stressCoping", e.target.value)} />
            </div>
            <div>
              <Label>Regular physical activity</Label>
              <div className="flex flex-wrap gap-2">
                {["Cardio","Strength","Yoga/Pilates","Sports","Walking"].map(o=>(
                  <Chip key={o} active={(data.activity||[]).includes(o)} onClick={()=>toggleInArray("activity", o)}>{o}</Chip>
                ))}
                <Chip active={(data.activity||[]).includes("None")} onClick={()=>toggleInArray("activity","None")}>None</Chip>
              </div>
            </div>
            <div>
              <Label>Diet style</Label>
              <Select value={data.diet} onChange={(e)=>setField("diet", e.target.value)}>
                <option value="">Select…</option>
                <option>Balanced</option><option>Vegetarian</option><option>Vegan</option>
                <option>Keto</option><option>Intermittent fasting</option><option>Other</option>
              </Select>
            </div>
            <div>
              <Label>Alcohol use</Label>
              <Select value={data.alcohol} onChange={(e)=>setField("alcohol", e.target.value)}>
                <option value="">Select…</option>
                <option>Never</option><option>Occasional</option><option>Weekly</option><option>Daily</option>
              </Select>
            </div>
            <div>
              <Label>Smoking</Label>
              <Select value={data.smoking} onChange={(e)=>setField("smoking", e.target.value)}>
                <option value="">Select…</option>
                <option>No</option><option>Yes</option><option>Former</option>
              </Select>
            </div>
            {showSmokingDetails && (
              <>
                <div>
                  <Label>Years smoking</Label>
                  <Input inputMode="numeric" value={data.smokingYears} onChange={(e)=>setField("smokingYears", e.target.value.replace(/[^\d]/g,""))}/>
                </div>
                <div>
                  <Label>Cigarettes per day</Label>
                  <Input inputMode="numeric" value={data.cigsPerDay} onChange={(e)=>setField("cigsPerDay", e.target.value.replace(/[^\d]/g,""))}/>
                </div>
              </>
            )}
            <div>
              <Label>Recreational substances</Label>
              <Select value={data.recSubstances} onChange={(e)=>setField("recSubstances", e.target.value)}>
                <option value="">Select…</option>
                <option>None</option><option>Rare</option><option>Occasional</option><option>Frequent</option>
              </Select>
            </div>
            <div>
              <Label>Screen time per day (h)</Label>
              <Input inputMode="numeric" placeholder="e.g., 3" value={data.screenTime} onChange={(e)=>setField("screenTime", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Hobbies that help you relax</Label>
              <Input placeholder="e.g., reading, music, gardening" value={data.hobbies} onChange={(e)=>setField("hobbies", e.target.value)} />
            </div>
          </div>
        </Section>
      </div>

      {/* ---- 4. Препараты и добавки ---- */}
      <div className="mt-5">
        <Section title="Medications & Supplements" icon="💊" tone="neutral">
          <div className="grid gap-4">
            <div>
              <Label>Current prescription meds (names & doses)</Label>
              <Textarea placeholder="e.g., Metformin 500 mg 2x/day" value={data.meds} onChange={(e)=>setField("meds", e.target.value)} />
            </div>
            <div>
              <Label>Supplements (names & purpose)</Label>
              <Textarea value={data.supps} onChange={(e)=>setField("supps", e.target.value)} />
            </div>
            <div>
              <Label>Drug allergies</Label>
              <Input value={data.drugAllergy} onChange={(e)=>setField("drugAllergy", e.target.value)} />
            </div>
            <div>
              <Label>Past side effects</Label>
              <Input value={data.drugSideEffects} onChange={(e)=>setField("drugSideEffects", e.target.value)} />
            </div>
          </div>
        </Section>
      </div>

      {/* ---- 5. Психоэмоциональное ---- */}
      <div className="mt-5">
        <Section title="Emotional & Mental Health" icon="🧠" tone="neutral">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Current state</Label>
              <Select value={data.moodNow} onChange={(e)=>setField("moodNow", e.target.value)}>
                <option value="">Select…</option>
                <option>Energized</option><option>Okay</option><option>Stressed</option>
                <option>Low mood</option><option>Anxious</option>
              </Select>
            </div>
            <div>
              <Label>Mood swings</Label>
              <Select value={data.moodSwings} onChange={(e)=>setField("moodSwings", e.target.value)}>
                <option value="">Select…</option>
                <option>Rare</option><option>Sometimes</option><option>Often</option>
              </Select>
            </div>
            <div>
              <Label>Anxiety (1–10)</Label>
              <Input type="range" min={0} max={10} value={data.anxiety} onChange={(e)=>setField("anxiety", e.target.value)} />
              <div className="text-xs text-neutral-600 mt-1">Current: {data.anxiety || 0}</div>
            </div>
            <div>
              <Label>Depression (1–10)</Label>
              <Input type="range" min={0} max={10} value={data.depression} onChange={(e)=>setField("depression", e.target.value)} />
              <div className="text-xs text-neutral-600 mt-1">Current: {data.depression || 0}</div>
            </div>
            <div>
              <Label>Therapy/counseling now?</Label>
              <Select value={data.therapy} onChange={(e)=>setField("therapy", e.target.value)}>
                <option value="">Select…</option>
                <option>Yes</option><option>No</option>
              </Select>
            </div>
            <div>
              <Label>Supportive environment?</Label>
              <Select value={data.socialSupport} onChange={(e)=>setField("socialSupport", e.target.value)}>
                <option value="">Select…</option>
                <option>Yes</option><option>No</option><option>Sometimes</option>
              </Select>
            </div>

            {showMentalExtras && (
              <div className="md:col-span-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                You reported high anxiety/depression. We will enable additional support modules and gentle check-ins. You can skip any question anytime.
              </div>
            )}
          </div>
        </Section>
      </div>

      {/* ---- 6. Среда ---- */}
      <div className="mt-5">
        <Section title="Environment" icon="🏠" tone="neutral">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Where do you live?</Label>
              <Select value={data.areaType} onChange={(e)=>setField("areaType", e.target.value)}>
                <option value="">Select…</option>
                <option>City</option><option>Suburb</option><option>Rural</option>
              </Select>
            </div>
            <div>
              <Label>Air/Water pollution nearby</Label>
              <div className="flex flex-wrap gap-2">
                {["Traffic","Industrial","Wildfire smoke","None"].map(o=>(
                  <Chip key={o} active={(data.pollution||[]).includes(o)} onClick={()=>toggleInArray("pollution", o)}>{o}</Chip>
                ))}
              </div>
            </div>
            <div>
              <Label>Home filters (air/water)</Label>
              <Select value={data.hasFilters} onChange={(e)=>setField("hasFilters", e.target.value)}>
                <option value="">Select…</option>
                <option>Yes</option><option>No</option>
              </Select>
            </div>
            <div>
              <Label>Pets at home</Label>
              <Select value={data.pets} onChange={(e)=>setField("pets", e.target.value)}>
                <option value="">Select…</option>
                <option>None</option><option>Dog</option><option>Cat</option><option>Other</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Time in nature (per week)</Label>
              <Input placeholder="e.g., 2–3 hours/week" value={data.natureFreq} onChange={(e)=>setField("natureFreq", e.target.value)} />
            </div>
          </div>
        </Section>
      </div>

      {/* ---- 7. Технологии ---- */}
      <div className="mt-5">
        <Section title="Devices & Apps" icon="📱" tone="neutral">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Wearables</Label>
              <div className="flex flex-wrap gap-2">
                {["Apple Watch","Fitbit","Garmin","Oura","BP monitor","Glucometer"].map(o=>(
                  <Chip key={o} active={(data.wearables||[]).includes(o)} onClick={()=>toggleInArray("wearables", o)}>{o}</Chip>
                ))}
                <Chip active={(data.wearables||[]).includes("None")} onClick={()=>toggleInArray("wearables","None")}>None</Chip>
              </div>
            </div>
            <div>
              <Label>Health/Fitness apps</Label>
              <Input placeholder="e.g., Apple Health, MyFitnessPal" value={data.healthApps} onChange={(e)=>setField("healthApps", e.target.value)} />
            </div>
            <div>
              <Label>Share device data with BioMath Core?</Label>
              <Select value={data.shareConsent} onChange={(e)=>setField("shareConsent", e.target.value)}>
                <option value="">Select…</option>
                <option>Yes</option><option>No</option><option>Ask me per feature</option>
              </Select>
            </div>
          </div>
        </Section>
      </div>

      {/* ---- 8. Цели ---- */}
      <div className="mt-5">
        <Section title="Goals & Motivation" icon="🎯" tone="lemon">
          <div className="grid gap-4">
            <div>
              <Label>What are your top health goals?</Label>
              <Textarea value={data.goals} onChange={(e)=>setField("goals", e.target.value)} />
            </div>
            <div>
              <Label>What does “wellness” mean to you?</Label>
              <Textarea value={data.wellnessMeaning} onChange={(e)=>setField("wellnessMeaning", e.target.value)} />
            </div>
            <div>
              <Label>Changes you’re ready to make in next 3 months</Label>
              <Textarea value={data.next3months} onChange={(e)=>setField("next3months", e.target.value)} />
            </div>
            <div>
              <Label>What holds you back?</Label>
              <Textarea value={data.blockers} onChange={(e)=>setField("blockers", e.target.value)} />
            </div>
          </div>
        </Section>
      </div>

      {/* ---- 9. Индивидуальные особенности ---- */}
      <div className="mt-5">
        <Section title="Individual Traits & Preferences" icon="🧩" tone="neutral">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Neurodiversity / sensitivities (self-reported)</Label>
              <div className="flex flex-wrap gap-2">
                {["ADHD","Autism","Sensory sensitivity","Dyslexia","None"].map(o=>(
                  <Chip key={o} active={(data.neuro||[]).includes(o)} onClick={()=>toggleInArray("neuro", o)}>{o}</Chip>
                ))}
              </div>
            </div>
            <div>
              <Label>Preferred format</Label>
              <div className="flex flex-wrap gap-2">
                {["Text","Video","Charts","Audio"].map(o=>(
                  <Chip key={o} active={(data.preferFormat||[]).includes(o)} onClick={()=>toggleInArray("preferFormat", o)}>{o}</Chip>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* ---- 10. Конфиденциальность ---- */}
      <div className="mt-5">
        <Section title="Privacy & Communication" icon="🔐" tone="neutral">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Data you’re comfortable sharing</Label>
              <div className="flex flex-wrap gap-2">
                {["Lifestyle","Medical","Devices","AI recommendations","None"].map(o=>(
                  <Chip key={o} active={(data.privacyShare||[]).includes(o)} onClick={()=>toggleInArray("privacyShare", o)}>{o}</Chip>
                ))}
              </div>
            </div>
            <div>
              <Label>Preferred communication (tone/frequency)</Label>
              <Input value={data.commPrefs} onChange={(e)=>setField("commPrefs", e.target.value)} placeholder="e.g., Weekly digest, concise tone" />
            </div>
            <div className="md:col-span-2">
              <Label>Security concerns</Label>
              <Textarea value={data.securityConcerns} onChange={(e)=>setField("securityConcerns", e.target.value)} />
            </div>
          </div>
        </Section>
      </div>

      {/* Surgeries */}
      <div className="mt-5">
        <Section title="Past Surgeries / Procedures" icon="🏥" tone="neutral">
          <Textarea placeholder="e.g., Appendectomy (2005), Knee surgery (2018)" value={data.surgeries} onChange={(e)=>setField("surgeries", e.target.value)} />
        </Section>
      </div>

      {/* actions */}
      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={()=>{ setBanner("Draft saved locally (in this browser tab)."); setTimeout(()=>setBanner(null), 3000); }}
          className="px-4 py-2 rounded-lg border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50"
        >
          Save draft
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={missing.length>0 || saving==="saving"}
          className={
            "px-5 py-2.5 rounded-lg " +
            (missing.length>0 || saving==="saving"
              ? "bg-violet-400 text-white opacity-70"
              : "bg-violet-600 text-white hover:bg-violet-500")
          }
        >
          {missing.length>0 ? `Complete ${missing.length} required` : (saving==="saving" ? "Submitting…" : "Submit")}
        </button>
      </div>

      {/* low-key footer nav */}
      <div className="mt-8 text-xs text-neutral-500">
        Forms menu:{" "}
        <Link className="text-violet-700 hover:text-violet-600 underline" href="/member-zone/forms">
          back to list
        </Link>
      </div>
    </div>
  );
}
