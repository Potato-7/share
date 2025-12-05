import { DomainError } from "../errors/domain-error";

export class TestNotFoundError extends DomainError {
  constructor(testId: number) {
    super(
      "TEST_NOT_FOUND",
      "指定されたテストが存在しません。",
      { testId },
    );
  }
}

