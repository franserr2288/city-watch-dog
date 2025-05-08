abstract class BaseExtractor implements IDataExtractor 
{
  abstract extract(): Promise<number>;
  abstract store(data:any): Promise<number>;
}

  