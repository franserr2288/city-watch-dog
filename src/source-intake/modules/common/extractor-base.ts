abstract class BaseExtractor implements IDataExtractor 
{
  abstract extract(): Promise<any>;
  abstract store(data:any): Promise<any>;
}

  