import { z } from "zod";

export const SurveysFileSchema = z.object({
  surveys: z.record(z.string().min(1), z.array(z.string().min(1)).min(1)),
});

export type SurveysFile = z.infer<typeof SurveysFileSchema>;
