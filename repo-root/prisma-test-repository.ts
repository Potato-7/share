import { prisma } from "@myproj/prisma-client";
import type { TestRepository } from "@myproj/domain/test/test.repository";
import type { Enrollment } from "@myproj/domain/enrollment/enrollment.entity";
import { TestInfo } from "@myproj/domain/test/test.entity";
import { DbError } from "../errors/infra-error";

export class PrismaTestRepository implements TestRepository {
  async findTestInfoForStudent(params: {
    testId: number;
    enrollment: Enrollment;
  }): Promise<TestInfo | null> {
    const { testId, enrollment } = params;

    try {
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
              jukoId: enrollment.jukoId,
            },
          },
        },
      });

      if (!row) return null;

      const submit = row.submit[0] ?? null;

      return new TestInfo(
        row.testId,
        row.testName,
        row.targetAnswerTime ? `${row.targetAnswerTime}分` : null,
        !!row.isScoreHidden,
        row.baseScore ? `${row.baseScore}点` : null,
        row.details[0]?.coverNotice ?? null,
        !!submit,
        submit?.correctAnswerRate ? `${submit.correctAnswerRate}%` : null,
        submit?.answerTime ? `${submit.answerTime}分` : null,
      );
    } catch (e) {
      throw new DbError("テスト情報取得中にDBエラーが発生しました。", e);
    }
  }
}

