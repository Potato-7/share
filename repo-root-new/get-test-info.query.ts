// apps/api/features/test/get-test-info/get-test-info.query.ts

import { prisma } from "@myproj/infra/prisma/client";
import type { StudentContext } from "../../_shared/validation/validate-student-context";

export type TestInfoRow = {
  testName: string;
  /**
   * DB の TIME 型 (HH:MM:SS) を文字列にしたもの
   */
  targetAnswerTime: string | null;
  isScoreHidden: boolean;
  baseScore: number | null;
  coverNotice: string | null;

  isSubmitted: boolean;
  correctAnswerRate: number | null;
  answerTimeSeconds: number | null;
};

export async function getTestInfoQuery(params: {
  testId: number;
  student: StudentContext;
}): Promise<TestInfoRow | null> {
  const { testId, student } = params;

  const row = await prisma.testMaster.findFirst({
    where: {
      testId,
      isDeleted: false,
      details: {
        some: {
          isDeleted: false,
          isPublicated: true,
        },
      },
    },
    select: {
      testName: true,
      targetAnswerTime: true,
      isScoreHidden: true,
      baseScore: true,
      details: {
        select: {
          coverNotice: true,
        },
        take: 1,
      },
      results: {
        where: {
          jukoId: student.jukoId,
        },
        select: {
          correctAnswerRate: true,
          answerTime: true,
        },
        take: 1,
      },
    },
  });

  if (!row) return null;

  const details = row.details[0] ?? null;
  const result = row.results[0] ?? null;

  const testInfo: TestInfoRow = {
    testName: row.testName,
    targetAnswerTime: row.targetAnswerTime
      ? row.targetAnswerTime.toString()
      : null,
    isScoreHidden: row.isScoreHidden,
    baseScore: row.baseScore,
    coverNotice: details?.coverNotice ?? null,
    isSubmitted: !!result,
    correctAnswerRate: result?.correctAnswerRate ?? null,
    answerTimeSeconds: result?.answerTime
      ? timeToSeconds(result.answerTime.toString())
      : null,
  };

  return testInfo;
}

function timeToSeconds(time: string): number {
  const [h, m, s] = time.split(":").map((v) => parseInt(v, 10) || 0);
  return h * 3600 + m * 60 + s;
}

