// apps/shikakuruapi/src/features/test/application/query/test-info.dto.ts

// ★ API で返す最終形
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

// ★ Prisma から受け取る “素材” の形
//   （必要なプロパティだけ書けば OK。余計なものは省略してよい）
export type TestInfoSource = {
  testMaster: {
    testName: string;
    targetAnswerTime: number | null;
    isScoreHidden: boolean | null;
    baseScore: number | null;
    coverNotice: string | null;
  };
  submit: {
    correctAnswerRate: number | null;
    answerTime: string | null;
  } | null;
  // details は今回 DTO に使っていないので型定義からは一旦外しておく
};

// ★ Prisma の結果 → DTO への変換
export function toTestInfoDto(source: TestInfoSource): TestInfoDto {
  const { testMaster, submit } = source;

  return {
    testName: testMaster.testName,
    targetAnswerTime:
      testMaster.targetAnswerTime != null
        ? String(testMaster.targetAnswerTime)
        : null,
    isScoreHidden: !!testMaster.isScoreHidden,
    baseScore:
      testMaster.baseScore != null ? String(testMaster.baseScore) : null,
    coverNotice: testMaster.coverNotice ?? null,
    isSubmitted: submit != null,
    correctAnswerRate:
      submit?.correctAnswerRate != null
        ? String(submit.correctAnswerRate)
        : null,
    answerTime: submit?.answerTime ?? null,
  };
}

