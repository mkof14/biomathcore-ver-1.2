import { QUESTIONNAIRE_REGISTRY } from "./registry";

export function getSensitiveSet(key: string, version: number): Set<string> {
  const q = QUESTIONNAIRE_REGISTRY[key];
  if (!q || q.version !== version) return new Set();
  const set = new Set<string>();
  for (const sec of q.sections) {
    for (const qq of sec.questions) {
      if (qq.isSensitive) set.add(qq.id);
    }
  }
  return set;
}
