// apps/shikakuruapi/src/app/api/test/info/[testId]/route.ts

import type { NextRequest } from "next/server";
import { createApiHandler } from "@/app/api/_shared/create-api-handler";
import { validateEnrollmentFromSession } from "@/app/api/_shared/validation";
import { testIdSchema } from "@myproj/validation/schemas/test";
import { getTestInfoQuery } from "@/features/test/application/query/get-test-info.query";

async function handler(req: NextRequest, ctx: { params: { testId: string } }) {
  // No.1〜7
  const { jukoId } = await validateEnrollmentFromSession(req);

  // No.8〜10 URL の testId バリデーション
  const testMasterTempId = testIdSchema.parse(ctx.params.testId);

  // SQL-01 相当の取得
  const testInfo = await getTestInfoQuery({ testMasterTempId, jukoId });

  if (!testInfo) {
    const { NotFoundError } = await import("@myproj/domain/errors/not-found-error");
    throw new NotFoundError("TEST_NOT_FOUND", { testMasterTempId });
  }

  return testInfo;
}

export const GET = createApiHandler(handler);

