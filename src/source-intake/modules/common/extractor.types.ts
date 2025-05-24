export interface IDataExtractor<T> {
  extract(): Promise<T[]>;
  store(data: T[]): Promise<boolean>;
}
