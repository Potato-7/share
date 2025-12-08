export class NotFoundError extends DomainError {
  constructor(code: string, params: string[] = []) {
    super(code, params);
  }
}

