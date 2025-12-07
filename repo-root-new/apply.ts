// apps/api/features/_shared/validation/schemas/apply.ts

import { z } from "zod";

/**
 * 申込情報マスタのキー（受講ID・コースコード・受講年）
 */
export const ApplyKeySchema = z.object({
  jukoId: z
    .string()
    .min(1, "MSG_STD_0000_001")
    .max(8, "MSG_STD_0000_005"),
  courseCode: z
    .string()
    .min(1, "MSG_STD_0000_001")
    .max(10, "MSG_STD_0000_017"),
  fiscalYear: z
    .string()
    .length(4, "MSG_STD_0000_008")
    .regex(/^\d{4}$/, "MSG_STD_0000_008"),
});

export type ApplyKey = z.infer<typeof ApplyKeySchema>;

