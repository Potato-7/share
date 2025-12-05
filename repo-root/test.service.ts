import type { TestRepository } from "./test.repository";
import type { Enrollment } from "../enrollment/enrollment.entity";
import { TestInfo } from "./test.entity";
import { TestNotFoundError } from "./test.errors";

export class TestService {
  constructor(private readonly repo: TestRepository) {}

  async getTestInfoForStudent(params: {
    testId: number;
    enrollment: Enrollment;
  }): Promise<TestInfo> {
    const testInfo = await this.repo.findTestInfoForStudent(params);
    if (!testInfo) {
      throw new TestNotFoundError(params.testId);
    }
    return testInfo;
  }
}

