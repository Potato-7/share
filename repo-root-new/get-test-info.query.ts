// apps/shikakuruapi/src/app/features/test/application/query/get-test-info.query.ts
import { prisma } from "@myproj/prisma-client";
import type { TestInfoDto } from "./test-info.dto";

/**
 * SQL-01: テスト情報取得処理
 *  - testMaster / testDetailMaster / testSubmit をJOINして
 *    仕様書の出力項目をそのまま組み立てるイメージ
 */
export async function getTestInfoQuery(params: {
  testId: number;
  jukoId: string;
}): Promise<TestInfoDto | null> {
  const { testId, jukoId } = params;

  // ここはあくまで「形のサンプル」
  // 実際は schema.prisma のモデル名に合わせて修正する
  const row = await prisma.testMaster.findFirst({
    where: {
      testId,
      isDeleted: false,
      details: {
        some: {
          isDeleted: false,
          isPublished: true,
        },
      },
    },
    include: {
      details: true,
      submit: {
        where: {
          jukoId,
        },
        take: 1,
      },
    },
  });

  if (!row) return null;

  const submit = row.submit[0] ?? null;

  const dto: TestInfoDto = {
    testId: row.testId,
    testName: row.testName,
    targetAnswerTime: row.targetAnswerTime
      ? `${row.targetAnswerTime}分`
      : null,
    isScoreHidden: row.isScoreHidden,
    baseScore: row.baseScore ? `${row.baseScore}点` : null,
    coverNotice: row.details[0]?.coverNotice ?? null,
    isSubmitted: !!submit,
    correctAnswerRate: submit?.correctAnswerRate
      ? `${submit.correctAnswerRate}%`
      : null,
    answerTime: submit?.answerTime ? `${submit.answerTime}分` : null,
  };

  return dto;
}

