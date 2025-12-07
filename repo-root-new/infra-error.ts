// packages/infra/errors/infra-error.ts

export class InfraError extends Error {
  public readonly detail?: unknown;

  constructor(message: string, detail?: unknown) {
    super(message);
    this.detail = detail;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

