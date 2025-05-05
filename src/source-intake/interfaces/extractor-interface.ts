interface IDataExtractor {
    extract(): Promise<any>;
    store(): Promise<any>;
  }