// features/test/application/query/get-test-info.query.ts

import { prisma } from '@myproj/prisma-client';
import type { Enrollment } from '@myproj/domain/enrollment/enrollment.entity';
import { TestInfo } from '@myproj/domain/test/test.entity';
import { toTestInfoDto, type TestInfoDto } from './test-info.dto';

/**
 * 受講生向けテスト情報取得クエリ
 * Prisma を直接叩いて TestInfo エンティティを作り、
 * DTO に変換して返す。
 */
export async function getTestInfoQuery(params: {
  testId: number;
  enrollment: Enrollment;
}): Promise<TestInfoDto | null> {
  const { testId, enrollment } = params;

  // ▼ Prisma でテスト情報 + 詳細 + 解答実績を取得
  const row = await prisma.testMaster.findFirst({
    where: {
      // 指定テスト
      testId,
      // テストマスタが未削除
      isDeleted: false,
      // 公開済みの詳細が1件はあること
      details: {
        some: {
          isDeleted: false,
          isPublished: true,
        },
      },
    },
    include: {
      // テスト詳細マスタ
      details: true,
      // この受講生の解答実績
      submit: {
        where: {
          jukoId: enrollment.jukoId,
        },
      },
    },
  });

  if (!row) return null;

  // 解答実績は 0 or 1 件想定
  const submit = row.submit[0] ?? null;

  // ▼ DB の生データ → ドメインエンティティ TestInfo に詰める
  const entity = new TestInfo(
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

  // ▼ エンティティ → DTO 変換して返す
  return toTestInfoDto(entity);
}

