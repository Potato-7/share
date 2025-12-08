// apps/shikakuruapi/src/app/api/_shared/get-valid-enrollment.ts
import { getSession } from "@/auth/session";
import { applySessionSchema } from "@myproj/validation/schemas/apply/apply";
import { findEnrollmentOrThrow } from "@/features/enrollment/application/find-enrollment-or-throw";

export async function getValidEnrollment() {
  const session = await getSession();

  // まとめて Zod でパース
  const { jukoId, fiscalYear, courseCode } = applySessionSchema.parse({
    jukoId: session?.jukoId,
    fiscalYear: session?.fiscalYear,
    courseCode: session?.courseCode,
  });

  await findEnrollmentOrThrow({ jukoId, fiscalYear, courseCode });

  return { jukoId, fiscalYear, courseCode };
}

