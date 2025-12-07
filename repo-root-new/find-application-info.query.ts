// apps/api/features/_shared/queries/find-application-info.query.ts

import { prisma } from "@myproj/infra/prisma/client";

export type ApplicationInfoRow = {
  jukoId: string;
  fiscalYear: number;
  courseCode: string;
};

export async function findApplicationInfoByKey(params: {
  jukoId: string;
  fiscalYear: string; // "2025"
  courseCode: string;
}): Promise<ApplicationInfoRow | null> {
  const { jukoId, fiscalYear, courseCode } = params;

  const row = await prisma.applicationInfo.findFirst({
    where: {
      jukoId,
      fiscalYear: Number(fiscalYear),
      courseCode,
      isDeleted: false,
    },
  });

  if (!row) return null;

  return {
    jukoId: row.jukoId,
    fiscalYear: row.fiscalYear,
    courseCode: row.courseCode,
  };
}

