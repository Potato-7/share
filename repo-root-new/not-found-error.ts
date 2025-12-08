import { DomainError } from "./domain-error";

export class NotFoundError extends DomainError {
  constructor(code: string, params: Record<string, unknown>) {
    super(code, "NOT_FOUND", params);
  }
}

