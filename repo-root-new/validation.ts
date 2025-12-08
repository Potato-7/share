// apps/shikakuruapi/src/app/api/_shared/validation.ts
import type { NextRequest } from "next/server";
import { getSession } from "@/auth/session";
import {
  jukoIdSchema,
  fiscalYearSchema,
  courseCodeSchema,
} from "@myproj/validation/schemas/apply";
import { testIdSchema } from "@myproj/validation/schemas/test";
import { findApplicationInfoExists } from "@/features/_shared/application/query/find-application-info.query";
import { NotFoundError } from "@myproj/domain/errors/not-found-error";

/**
 * No.1〜7: セッションから受講ID/受講年/コースコードを取得し、
 *  - 必須
 *  - 書式
 *  - 申込情報マスタ存在チェック
 * を一括で行うラッパー
 */
export async function validateEnrollmentFromSession(req: NextRequest) {
  const session = await getSession();

  const jukoId = jukoIdSchema.parse(session?.jukoId);
  const fiscalYear = fiscalYearSchema.parse(session?.fiscalYear);
  const courseCode = courseCodeSchema.parse(session?.courseCode);

  const exists = await findApplicationInfoExists({
    jukoId,
    fiscalYear,
    courseCode,
  });

  if (!exists) {
    // ここは 403 / MSG_xxx を返す想定
    throw new NotFoundError("ENROLLMENT_NOT_FOUND", {
      jukoId,
      fiscalYear,
      courseCode,
    });
  }

  return { jukoId, fiscalYear, courseCode };
}

/**
 * No.8〜10: URLの testId をチェック
 */
export function validateTestIdFromParams(params: { testId?: string }) {
  const id = Number(params.testId);
  return testIdSchema.parse(id);
}

