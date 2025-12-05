import type { TestInfoDto, TestInfoViewModel } from "./test-info.dto";

type ApiResponse<T> = {
  status: number;
  message: string | null;
  result: T;
};

export async function getTestInfoQuery(testId: number): Promise<TestInfoViewModel> {
  const res = await fetch(`/api/test/info/${testId}`);

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiResponse<unknown> | null;
    const msg = body?.message ?? "テスト情報の取得に失敗しました。";
    throw new Error(msg);
  }

  const body = (await res.json()) as ApiResponse<TestInfoDto>;
  const dto = body.result;

  // DTO → 画面用 ViewModel に変換
  return {
    ...dto,
    submittedLabel: dto.isSubmitted ? "提出済み" : "未提出",
  };
}

