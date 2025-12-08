export abstract class DomainError extends Error {
  public readonly code: string;
  public readonly params: string[];

  constructor(code: string, params: string[] = []) {
    super(code); // message は外部で formatMessage するので code を保持しておく
    this.code = code;
    this.params = params;
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }
}

