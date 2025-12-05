import { z } from "zod";

/**
 * 受講生共通：jukoId / fiscalYear / courseCode
 * バリデーション No.1〜6 のうち「書式・桁数チェック」をここに集約
 */
export const jukoIdSchema = z
  .string()
  .min(1, "受講IDは必須です。")
  .max(8, "受講IDは8桁以下で入力してください。")
  .regex(/^[0-9]+$/, "受講IDは数字のみで入力してください。");

export const fiscalYearSchema = z
  .string()
  .min(1, "受講年度は必須です。")
  .regex(/^\d{4}$/, "受講年度は yyyy 形式で入力してください。");

export const courseCodeSchema = z
  .string()
  .min(1, "コースコードは必須です。")
  .max(10, "コースコードは10桁以下で入力してください。");

