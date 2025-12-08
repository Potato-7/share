import { prisma } from "@myproj/prisma-client";
import { NotFoundError } from "@myproj/domain/errors/not-found-error";

export async function findEnrollmentOrThrow(params: {
  jukoId: number;
  fiscalYear: string;
  courseCode: string;
}) {
  const row = await prisma.enrollment.findFirst({
    where: {
      jukoId: params.jukoId,
      fiscalYear: params.fiscalYear,
      courseCode: params.courseCode,
      isDeleted: false
    }
  });

  if (!row) {
    throw new NotFoundError("ENROLLMENT_NOT_FOUND", params);
  }

  return row;
}

