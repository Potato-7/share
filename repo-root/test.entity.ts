export class TestInfo {
  constructor(
    public readonly testId: number,
    public readonly testName: string,
    public readonly targetAnswerTime: string | null, // "75分" などフォーマット後でもOK
    public readonly isScoreHidden: boolean,
    public readonly baseScore: string | null,
    public readonly coverNotice: string | null,
    public readonly isSubmitted: boolean,
    public readonly correctAnswerRate: string | null, // "87%" など
    public readonly answerTime: string | null,        // "76分" など
  ) {}
}

