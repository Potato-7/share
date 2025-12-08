// apps/shikakuruapi/src/features/test/application/query/get-test-info.query.ts
import { prisma } from "@myproj/prisma-client";
import { toTestInfoDto } from "./test-info.dto";

// 返却用の型は適当に
export type TestInfoRow = ReturnType<typeof toTestInfoDto>;

export async function getTestInfoQuery(params: {
  testMasterTempId: number;
  jukoId: string;
}): Promise<TestInfoRow | null> {
  const { testMasterTempId, jukoId } = params;

  // ① テストマスタ（Wテストマスタ）を1件取得
  const testMaster = await prisma.wTestMaster.findFirst({
    where: {
      testMasterTempId,
      isDeleted: false,
    },
  });

  if (!testMaster) return null;

  // ② 設問詳細を別クエリで取得
  const details = await prisma.testDetail.findMany({
    where: {
      testId: testMaster.testId,
      isDeleted: false,
      // isPublished: true, など必要な条件
    },
    orderBy: { testDetailId: "asc" },
  });

  // ③ 提出情報を別クエリで取得（必要なら）
  const submit = await prisma.tTestSubmit.findFirst({
    where: {
      testId: testMaster.testId,
      jukoId,
    },
  });

  // ④ DTO にまとめて返す
  return toTestInfoDto({
    testMaster,
    details,
    submit,
  });
}

