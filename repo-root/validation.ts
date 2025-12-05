import type { NextRequest } from "next/server";
import { jukoIdSchema, fiscalYearSchema, courseCodeSchema } from "@myproj/validation/server-common/std/base-schemas";
import { testIdSchema } from "@myproj/validation/schemas/test";
import { EnrollmentService } from "@myproj/domain/enrollment/enrollment.service";
import { PrismaEnrollmentRepository } from "@myproj/infrastructure/repositories/prisma-enrollment.repository";

const enrollmentService = new EnrollmentService(new PrismaEnrollmentRepository());

/**
 * バリデーション No.1〜7:
 *  jukoId / fiscalYear / courseCode の「必須＋形式＋存在チェック」ラッパ
 */
export async function validateEnrollmentFromSession(req: NextRequest) {
  const session = await getSession(); // 既存のセッション取得関数を使用
  if (!session) {
    throw new Error("Unauthorized"); // 本当は専用エラーでもOK
  }

  const jukoId = jukoIdSchema.parse(session.jukoId);
  const fiscalYear = fiscalYearSchema.parse(session.fiscalYear);
  const courseCode = courseCodeSchema.parse(session.courseCode);

  // No.7: 申込情報存在チェック（Domain Service）
  const enrollment = await enrollmentService.ensureExists({
    jukoId,
    fiscalYear,
    courseCode,
  });

  return { jukoId, fiscalYear, courseCode, enrollment };
}

/**
 * バリデーション No.8〜10: testId
 */
export function validateTestId(rawTestId: string | string[] | undefined): number {
  if (!rawTestId || Array.isArray(rawTestId)) {
    throw new Error("Invalid testId parameter");
  }
  const testIdNum = Number(rawTestId);
  return testIdSchema.parse(testIdNum);
}

// 既存の getSession を仮定
async function getSession() {
  // apps/shikakuruapi で既に使っているセッション取得ロジックに合わせて書き換え
  const { auth } = await import("@myproj/auth/server");
  return auth();
}

