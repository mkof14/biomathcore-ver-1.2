import { z } from "zod";

export const AnswerPayload = z.object({
  questionId: z.string(),
  value: z.any().optional(),
  preferNotToSay: z.boolean().optional(),
});

export const SaveAnswersBody = z.object({
  sessionId: z.string().optional(),
  questionnaireId: z.string().optional(),
  questionnaireKey: z.string().optional(),
  version: z.number().int().positive(),
  visibility: z.enum(["identified", "anonymous"]).default("identified"),
  answers: z.array(AnswerPayload),
  progress: z.number().min(0).max(100).optional(),
  submit: z.boolean().optional(),
});

export type SaveAnswersBodyType = z.infer<typeof SaveAnswersBody>;
