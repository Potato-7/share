import type { NextRequest } from "next/server";
import { createApiHandler } from "../../_shared/create-api-handler";
import { validateEnrollmentFromSession, validateTestId } from "../../_shared/validation";
import { TestService } from "@myproj/domain/test/test.service";
import { PrismaTestRepository } from "@myproj/infrastructure/repositories/prisma-test.repository";

const testService = new TestService(new PrismaTestRepository());

export const GET = createApiHandler(async (req: NextRequest, { params }: { params: { testId: string } }) => {
  // 共通：受講ID＋年度＋コースコードのラッパ
  const { enrollment } = await validateEnrollmentFromSession(req);

  // 今API固有：testId の取得＆チェック
  const testId = validateTestId(params.testId);

  // ドメインサービス呼び出し
  const testInfo = await testService.getTestInfoForStudent({
    testId,
    enrollment,
  });

  // ここではドメインエンティティをそのまま result に返してOK
  // （画面に合わせたフォーマットは features 側でやる想定）
  return Response.json(
    {
      status: 200,
      message: null,
      result: {
        testName: testInfo.testName,
        targetAnswerTime: testInfo.targetAnswerTime,
        isScoreHidden: testInfo.isScoreHidden,
        baseScore: testInfo.baseScore,
        coverNotice: testInfo.coverNotice,
        isSubmitted: testInfo.isSubmitted,
        correctAnswerRate: testInfo.correctAnswerRate,
        answerTime: testInfo.answerTime,
      },
    },
    { status: 200 },
  );
});

