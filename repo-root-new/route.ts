import { createApiHandler } from "@/app/api/_shared/create-api-handler";
import { testIdSchema } from "@myproj/validation/schemas/test/test-id.schema";
import { getValidEnrollment } from "@/app/api/_shared/get-valid-enrollment";
import { getTestInfoQuery } from "@/features/test/application/get-test-info.query";

async function handler(req: Request, { params }: { params: { testId: string } }) {
  const testId = testIdSchema.parse(Number(params.testId));

  const enrollment = await getValidEnrollment();

  const result = await getTestInfoQuery(testId, {
    courseCode: enrollment.courseCode,
    fiscalYear: enrollment.fiscalYear
  });

  return Response.json(
    { status: 200, result },
    { status: 200 }
  );
}

export const GET = createApiHandler(handler);

