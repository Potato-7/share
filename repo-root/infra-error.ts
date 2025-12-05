export class InfraError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
  }
}

export class DbError extends InfraError {}

