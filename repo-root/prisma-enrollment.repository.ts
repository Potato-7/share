import { prisma } from "@myproj/prisma-client";
import { Enrollment } from "@myproj/domain/enrollment/enrollment.entity";
import type {
  EnrollmentRepository,
  FindEnrollmentKey,
} from "@myproj/domain/enrollment/enrollment.repository";
import { DbError } from "../errors/infra-error";

export class PrismaEnrollmentRepository implements EnrollmentRepository {
  async findByKey(key: FindEnrollmentKey): Promise<Enrollment | null> {
    try {
      const row = await prisma.apply.findFirst({
        where: {
          jukoId: key.jukoId,
          fiscalYear: key.fiscalYear,
          courseCode: key.courseCode,
          isDeleted: false,
        },
      });

      if (!row) return null;
      return new Enrollment(row.jukoId, row.fiscalYear, row.courseCode);
    } catch (e) {
      throw new DbError("申込情報取得中にDBエラーが発生しました。", e);
    }
  }
}

