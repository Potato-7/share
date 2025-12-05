import { z } from "zod";

/**
 * テスト情報取得API：testId用
 * バリデーション No.8〜10
 */
export const testIdSchema = z
  .number({
    required_error: "テストIDは必須です。",
    invalid_type_error: "テストIDは数値で入力してください。",
  })
  .int("テストIDは整数で入力してください。")
  .min(1, "テストIDは1以上で入力してください。");

