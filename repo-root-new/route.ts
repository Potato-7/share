// apps/api/features/test/get-test-info/route.ts

import type { NextRequest } from "next/server";
import { createApiHandler } from "../../_shared/api/create-api-handler";
import { validateStudentContext } from "../../_shared/validation/validate-student-context";
import { getTestInfoQuery } from "./get-test-info.query";
import { toTestInfoDto, type GetTestInfoResponse } from "./test-info.dto";
import { DomainError } from "@myproj/domain/common/domain-error";
import { NotFoundError } from "../../_shared/errors/not-found-error";
import { TestIdSchema } from "../../_shared/validation/schemas/test";

const getTestInfo = createApiHandler(
  async (req: NextRequest, ctx: { params: { testId: string } }) => {
    // ① 受講生共通バリデーション
    const student = await validateStudentContext(req);

    // ② testId 形式チェック
    const rawId = Number(ctx.params.testId);
    const parsedId = TestIdSchema.safeParse(rawId);
    if (!parsedId.success) {
      throw new DomainError("MSG_STD_0000_008", { target: "テストID" });
    }
    const testId = parsedId.data;

    // ③ テスト情報取得
    const row = await getTestInfoQuery({ testId, student });
    if (!row) {
      throw new NotFoundError("MSG_TEST_0001", { testId });
    }

    const dto = toTestInfoDto(row);

    const body: GetTestInfoResponse = {
      status: 200,
      message: null,
      result: dto,
    };

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
);

export { getTestInfo as GET };

