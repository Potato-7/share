import type { TestInfo } from "@myproj/domain/test/test.entity";

// APIレスポンス result の型
export type TestInfoDto = {
  testName: string;
  targetAnswerTime: string | null;
  isScoreHidden: boolean;
  baseScore: string | null;
  coverNotice: string | null;
  isSubmitted: boolean;
  correctAnswerRate: string | null;
  answerTime: string | null;
};

// ドメイン → DTO 変換関数
export function toTestInfoDto(entity: TestInfo): TestInfoDto {
  return {
    testName: entity.testName,
    targetAnswerTime: entity.targetAnswerTime,
    isScoreHidden: entity.isScoreHidden,
    baseScore: entity.baseScore,
    coverNotice: entity.coverNotice,
    isSubmitted: entity.isSubmitted,
    correctAnswerRate: entity.correctAnswerRate,
    answerTime: entity.answerTime,
  };
}

