import { DomainError } from "../errors/domain-error";

export class EnrollmentNotFoundError extends DomainError {
  constructor(params: { jukoId: string; fiscalYear: string; courseCode: string }) {
    super(
      "ENROLLMENT_NOT_FOUND",
      "申込情報が存在しません。",
      params,
    );
  }
}

