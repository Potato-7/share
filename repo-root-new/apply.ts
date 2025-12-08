// packages/validation/schemas/apply.ts
import { z } from "zod";
import { formatMessage } from "@myproj/messages/std";

/**
 * 受講共通：申込情報系スキーマ
 * バリデーション No.1〜6
 *
 * No.1 jukoId 必須
 * No.2 jukoId 桁数（8桁以下）
 * No.3 courseCode 必須
 * No.4 courseCode 桁数（10桁）
 * No.5 fiscalYear 必須
 * No.6 fiscalYear 書式チェック（yyyy）
 */

// 受講ID
export const jukoIdSchema = z
  .string()
  // No.1 必須チェック
  .refine((val) => val !== undefined && val !== null && val !== "", {
    message: formatMessage("MSG_STD_0000_0001", "受講ID"), // 「受講IDは必須です」
  })
  // No.2 桁数チェック（8桁以下）
  .max(8, formatMessage("MSG_STD_0000_0002", "受講ID", "8")); // 「受講IDは8桁以下で入力してください」

// コースコード
export const courseCodeSchema = z
  .string()
  // No.3 必須チェック
  .refine((val) => val !== undefined && val !== null && val !== "", {
    message: formatMessage("MSG_STD_0000_0001", "コースコード"), // 「コースコードは必須です」
  })
  // No.4 桁数チェック（10桁）
  .length(10, formatMessage("MSG_STD_0000_0002", "コースコード", "10")); // 「コースコードは10桁で入力してください」

// 受講年度（yyyy）
export const fiscalYearSchema = z
  .string()
  // No.5 必須チェック
  .refine((val) => val !== undefined && val !== null && val !== "", {
    message: formatMessage("MSG_STD_0000_0001", "受講年度"), // 「受講年度は必須です」
  })
  // No.6 書式チェック yyyy
  .refine((val) => /^[0-9]{4}$/.test(val), {
    message: formatMessage("MSG_STD_0000_0003", "受講年度", "yyyy"), // 「受講年度はyyyy形式で入力してください」みたいな想定
  });

