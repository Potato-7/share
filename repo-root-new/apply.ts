// packages/validation/schemas/apply.ts
import { z } from "zod";
import { formatMessage } from "@myproj/messages/std"; // 既存のmessagesパッケージ前提

/**
 * 受講ID
 *  No.1: 必須
 *  No.2: 桁数チェック（8桁以下）
 */
export const jukoIdSchema = z
  .string({
    required_error: formatMessage("MSG_STD_APPLY_0001", "受講ID"),
    invalid_type_error: formatMessage("MSG_STD_APPLY_0002", "受講ID"),
  })
  .min(1, formatMessage("MSG_STD_APPLY_0001", "受講ID"))
  .max(8, formatMessage("MSG_STD_APPLY_0003", "受講ID", "8"))
  .regex(/^\d+$/, formatMessage("MSG_STD_APPLY_0004", "受講ID"));

/**
 * コースコード
 *  No.3: 必須
 *  No.4: 桁数チェック（10桁）
 */
export const courseCodeSchema = z
  .string({
    required_error: formatMessage("MSG_STD_APPLY_0001", "コースコード"),
    invalid_type_error: formatMessage("MSG_STD_APPLY_0002", "コースコード"),
  })
  .min(1, formatMessage("MSG_STD_APPLY_0001", "コースコード"))
  .max(10, formatMessage("MSG_STD_APPLY_0003", "コースコード", "10"))
  .regex(/^[0-9A-Z]+$/, formatMessage("MSG_STD_APPLY_0004", "コースコード"));

/**
 * 受講年
 *  No.5: 必須
 *  No.6: 書式チェック(yyyy)
 */
export const fiscalYearSchema = z
  .string({
    required_error: formatMessage("MSG_STD_APPLY_0001", "受講年"),
    invalid_type_error: formatMessage("MSG_STD_APPLY_0002", "受講年"),
  })
  .regex(/^\d{4}$/, formatMessage("MSG_STD_APPLY_0005", "受講年"));

