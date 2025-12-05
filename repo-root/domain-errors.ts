export type DomainErrorCode =
  | "ENROLLMENT_NOT_FOUND"
  | "TEST_NOT_FOUND";

export abstract class DomainError extends Error {
  public readonly code: DomainErrorCode;
  public readonly params: Record<string, unknown>;

  constructor(code: DomainErrorCode, message: string, params: Record<string, unknown> = {}) {
    super(message);
    this.code = code;
    this.params = params;
  }
}

