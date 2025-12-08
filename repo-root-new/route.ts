// apps/shikakuruapi/src/app/api/test/info/[testId]/route.ts
import type { NextRequest } from "next/server";
import { createApiHandler } from "@/app/api/_shared/create-api-handler";
import { validateEnrollmentFromSession } from "@/app/api/_shared/validation";
import { getTestInfoQuery } from "@/app/features/test/application/query/get-test-info.query";
import { testIdSchema } from "@myproj/validation/schemas/test";
import { NotFoundError } from "@myproj/domain/errors/not-found-error";

/**
 * GET /api/test/info/[testId]
 */
export const GET = createApiHandler(
  async function handler(
    req: NextRequest,
    ctx: { params: { testId: string } }
  ) {
    // No.1〜7: セッションから受講ID など取得 & バリデーション
    const { jukoId } = await validateEnrollmentFromSession(req);

    // No.8〜10: URL の testId をチェック
    const testId = testIdSchema.parse(Number(ctx.params.testId));

    // SQL-01 相当の取得処理
    const testInfo = await getTestInfoQuery({
      testMasterTempId: testId,
      jukoId,
    });

    if (!testInfo) {
      throw new NotFoundError("TEST_NOT_FOUND", { testId });
    }

    // createApiHandler が {status, message, result} に包んで返してくれる
    // handler 側は「result だけ」返す
    return testInfo;
  }
);

