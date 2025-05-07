interface IDataExtractor {
    extract(): Promise<any>;
    store(data:any): Promise<any>;
  }