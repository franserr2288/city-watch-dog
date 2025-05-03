abstract class BaseExtractor implements IDataExtractor {

  protected url: string;
  protected tableName: string;

  constructor(url: string, tableName?: string) {
    this.url = url;
    this.tableName = tableName ?? this.deriveTableName(url);
  }

  protected deriveTableName(url: string): string {
    return url.split('/').pop() || 'default_table';
  }

  abstract transform(data: any): any;
  abstract extract(): Promise<void>;
  abstract store(): Promise<any>;
}

  