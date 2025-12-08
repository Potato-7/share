// apps/shikakuruapi/src/features/test/application/query/get-test-info.query.ts

import { PrismaClient } from "@myproj/prisma-client";
import {
  toTestInfoDto,
  type TestInfoDto,
  type TestInfoSource,
} from "./test-info.dto";

export type TestInfoRow = TestInfoDto;

const prisma = new PrismaClient();

export async function getTestInfoQuery(params: {
  testMasterTempId: number; // URL の testId を変換したもの
  jukoId: string;
}): Promise<TestInfoRow | null> {
  const { testMasterTempId, jukoId } = params;

  // ① Wテストマスタを取得
  const testMaster = await prisma.wTestMaster.findFirst({
    where: {
      testMasterTempId,
      isDeleted: false,
    },
  });

  if (!testMaster) return null;

  // ② （必要なら）設問詳細は別クエリ
  //    今回の DTO では使っていないので、ここでは取得だけ or 削っても OK
  // const details = await prisma.testDetail.findMany({
  //   where: {
  //     testId: testMaster.testMasterTempId,
  //     isDeleted: false,
  //     isPublished: true,
  //   },
  //   orderBy: { testDetailId: "asc" },
  // });

  // ③ 提出情報を取得
  const submit = await prisma.testResult.findFirst({
    where: {
      testId: testMaster.testMasterTempId,
      jukoId,
    },
  });

  const source: TestInfoSource = {
    testMaster: {
      testName: testMaster.testName,
      targetAnswerTime: testMaster.targetAnswerTime,
      isScoreHidden: testMaster.isScoreHidden,
      baseScore: testMaster.baseScore,
      coverNotice: testMaster.coverNotice,
    },
    submit: submit
      ? {
          correctAnswerRate: submit.correctAnswerRate,
          answerTime: submit.answerTime,
        }
      : null,
  };

  return toTestInfoDto(source);
}

