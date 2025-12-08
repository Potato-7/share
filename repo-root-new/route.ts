// apps/shikakuruapi/src/app/api/test/info/[testId]/route.ts
import type { NextRequest } from "next/server";
import { createApiHandler } from "@/app/api/_shared/create-api-handler";
import {
  validateEnrollmentFromSession,
  validateTestIdFromParams,
} from "@/app/api/_shared/validation";
import { getTestInfoQuery } from "@/features/test/application/query/get-test-info.query";

/**
 * GET /api/test/info/[testId]
 */
async function handler(req: NextRequest, ctx: { params: { testId: string } }) {
  // No.1〜7
  const { jukoId, fiscalYear, courseCode } =
    await validateEnrollmentFromSession(req);

  // No.8〜10
  const testId = validateTestIdFromParams(ctx.params);

  // SQL-01 相当の取得処理
  const testInfo = await getTestInfoQuery({ testId, jukoId });

  if (!testInfo) {
    // NotFoundError を投げる or ここで直接 NotFound を返してもOK
    // ここでは NotFoundError に任せるパターンの方が一貫性がある
    throw new (await import("@myproj/domain/errors/not-found-error")).NotFoundError(
      "TEST_NOT_FOUND",
      { testId },
    );
  }

  // createApiHandler が {status, message, result} に包んでくれるので
  // handler 側は「result だけ返す」
  return testInfo;
}

export const GET = createApiHandler(handler);

