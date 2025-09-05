import { prisma } from "@/lib/prisma";

type Input = {
  userId: string;
  type: "core" | "sexual_health" | "longevity";
  payload?: any;
};

async function loadTemplate(t: Input["type"]) {
  if (t === "core") {
    return (await import("./templates/core-health.md?raw")).default;
  } else if (t === "sexual_health") {
    return (await import("./templates/sexual-health.md?raw")).default;
  } else {
    return (await import("./templates/longevity.md?raw")).default;
  }
}

async function loadUserSnapshot(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { questionnaireInstances: { include: { answers: true, questionnaire: true } }, subscriptions: true } });
  return user;
}

function fill(template: string, data: Record<string,string>) {
  return template
    .replace("{{profile}}", data.profile || "")
    .replace("{{findings}}", data.findings || "")
    .replace("{{recommendations}}", data.recommendations || "")
    .replace("{{sexual_function}}", data.sexual_function || "")
    .replace("{{hormonal_indicators}}", data.hormonal_indicators || "")
    .replace("{{lifestyle}}", data.lifestyle || "")
    .replace("{{risk_indicators}}", data.risk_indicators || "");
}

async function llmSummarize(sections: Record<string,string>) {
  const pieces = Object.entries(sections).map(([k,v]) => `### ${k}\n${v}`).join("\n\n");
  return pieces;
}

export async function generateReport(input: Input) {
  const template = await loadTemplate(input.type);
  const user = await loadUserSnapshot(input.userId);

  const profile = JSON.stringify({ name: user?.name || "", email: user?.email || "" });
  const findings = "Key findings synthesized from questionnaires.";
  const recommendations = "Personalized recommendations.";
  const sexual_function = "Trends and changes based on responses.";
  const hormonal_indicators = "Signals suggestive of hormonal shifts.";
  const lifestyle = "Activity, sleep, nutrition overview.";
  const risk_indicators = "Potential risk areas.";

  const drafted = await llmSummarize({ profile, findings, recommendations, sexual_function, hormonal_indicators, lifestyle, risk_indicators });
  const md = fill(template, { profile, findings, recommendations, sexual_function, hormonal_indicators, lifestyle, risk_indicators });

  return {
    title: input.type === "core" ? "Core Health Report" : input.type === "sexual_health" ? "Sexual Health Report" : "Longevity Report",
    markdown: md + "\n\n" + drafted
  };
}
