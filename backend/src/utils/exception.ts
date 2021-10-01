type ErrorField = { field: string; detail: Array<string> };

export default class Exception extends Error {
  errors: Array<ErrorField>;

  constructor(errors: Array<ErrorField>) {
    super('Error');
    this.errors = errors;
  }
}
