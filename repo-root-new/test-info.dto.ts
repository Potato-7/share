// apps/api/features/test/get-test-info/test-info.dto.ts

import type { TestInfoRow } from "./get-test-info.query";

export type TestInfoDto = {
  testName: string;
  targetAnswerTime: string | null;   // "30分"
  isScoreHidden: boolean;
  baseScore: string | null;          // "20点"
  coverNotice: string | null;
  isSubmitted: boolean;
  correctAnswerRate: string | null;  // "87%"
  answerTime: string | null;         // "34分"
};

export type GetTestInfoResponse = {
  status: number;
  message: string | null;
  result: TestInfoDto | null;
};

export function toTestInfoDto(row: TestInfoRow): TestInfoDto {
  return {
    testName: row.testName,
    targetAnswerTime: row.targetAnswerTime
      ? `${parseInt(row.targetAnswerTime.slice(0, 2), 10)}分`
      : null,
    isScoreHidden: row.isScoreHidden,
    baseScore: row.baseScore !== null ? `${row.baseScore}点` : null,
    coverNotice: row.coverNotice,
    isSubmitted: row.isSubmitted,
    correctAnswerRate:
      row.correctAnswerRate !== null ? `${row.correctAnswerRate}%` : null,
    answerTime:
      row.answerTimeSeconds !== null
        ? `${Math.round(row.answerTimeSeconds / 60)}分`
        : null,
  };
}

