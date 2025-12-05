import type { Enrollment } from "../enrollment/enrollment.entity";
import type { TestInfo } from "./test.entity";

export interface TestRepository {
  findTestInfoForStudent(params: {
    testId: number;
    enrollment: Enrollment;
  }): Promise<TestInfo | null>;
}

