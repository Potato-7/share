// packages/validation/src/schemas/apply/apply.ts
import { z } from "zod";

export const applySessionSchema = z.object({
  jukoId: z
    .number({
      required_error: "受講IDは必須です",
      invalid_type_error: "受講IDが不正です",
    })
    .int()
    .positive(),

  fiscalYear: z
    .string()
    .regex(/^\d{4}$/, "年度の形式が不正です"),

  courseCode: z
    .string()
    .min(1, "コースコードが空です"),
});

// 必要なら個別スキーマも欲しいとき用（お好みで）
export const jukoIdSchema = applySessionSchema.shape.jukoId;
export const fiscalYearSchema = applySessionSchema.shape.fiscalYear;
export const courseCodeSchema = applySessionSchema.shape.courseCode;

