// APIレスポンスの result 部分そのまま
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

// 画面用の ViewModel（必要なら）
export type TestInfoViewModel = TestInfoDto & {
  // 例えば「提出済みかどうか」を文言にしたものなど
  submittedLabel: string;
};

