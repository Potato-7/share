// apps/shikakuruapi/src/app/features/_shared/application/query/find-application-info.query.ts
import { prisma } from "@myproj/prisma-client";

/**
 * 申込情報マスタ存在チェック（No.7）
 * 「存在すれば true / 存在しなければ false」を返すだけのシンプルなQuery
 */
export async function findApplicationInfoExists(params: {
  jukoId: string;
  fiscalYear: string;
  courseCode: string;
}): Promise<boolean> {
  const { jukoId, fiscalYear, courseCode } = params;

  const count = await prisma.applicationMaster.count({
    where: {
      jukoId,
      fiscalYear,
      courseCode,
      isDeleted: false,
    },
  });

  return count > 0;
}

