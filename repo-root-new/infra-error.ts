export class InfraError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }
}

export class DbError extends InfraError {
  constructor(cause?: unknown) {
    super("Database error", cause);
  }
}

