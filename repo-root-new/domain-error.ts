// packages/domain/common/domain-error.ts

export class DomainError extends Error {
  public readonly code: string;
  public readonly params: Record<string, unknown>;

  constructor(code: string, params: Record<string, unknown> = {}) {
    super(code);
    this.code = code;
    this.params = params;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

