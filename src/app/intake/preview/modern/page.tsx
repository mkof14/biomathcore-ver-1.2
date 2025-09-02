import FormRenderer from "@/components/forms/FormRenderer";
import { QUESTIONNAIRE_REGISTRY } from "@/lib/questionnaire/registry";
export default function Page() {
  const schema = QUESTIONNAIRE_REGISTRY["core-profile"];
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <FormRenderer schema={schema} questionnaireKey="core-profile" visibility="identified" themeName="modern" />
    </main>
  );
}
