export class DataSourceError extends Error {
  public readonly code = 'DATA_SOURCE_ERR';

  constructor(message: string) {
    super(message);
    this.name = 'DataSourceError';
    Object.setPrototypeOf(this, DataSourceError.prototype);
  }
}
