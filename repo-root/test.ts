import { z } from "zod";
import { formatMessage } from "@myproj/messages/std";

/**
 * テスト情報取得API : testId用
 * バリデーション No.8〜10
 */
export const testIdSchema = z
  .number()
  // No.8 必須 ＋ 型チェック
  .refine(
    (val) => val !== undefined && val !== null,
    formatMessage("MSG_STD_0000_0001", "テストID"), // 「テストIDは必須です」
  )
  // No.9 整数チェック
  .int(formatMessage("MSG_STD_0000_0002", "テストID"))       // 「テストIDは整数で入力してください」
  // No.10 1以上
  .min(1, formatMessage("MSG_STD_0000_0003", "テストID", "1")); // 「テストIDは1以上で入力してください」

