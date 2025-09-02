export type QuestionnaireSchema = {
  id: string;
  version: number;
  title: string;
  description?: string;
  sections: Section[];
  logicRules?: LogicRule[];
};

export type Section = {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
};

export type Question = {
  id: string;
  type: "single" | "multi" | "text" | "number" | "scale" | "boolean" | "date";
  label: string;
  description?: string;
  isSensitive?: boolean;
  required?: boolean;
  allowPreferNotToSay?: boolean;
  options?: Option[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
};

export type Option = {
  value: string;
  label: string;
};

export type LogicRule = {
  when: {
    questionId: string;
    operator: "equals" | "notEquals" | "includes" | "gt" | "lt";
    value: any;
  };
  then: {
    showQuestionIds?: string[];
    hideQuestionIds?: string[];
    requireQuestionIds?: string[];
  };
};
