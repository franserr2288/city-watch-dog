import type { IDataExtractor } from './extractor.types';

export abstract class BaseExtractor<T> implements IDataExtractor<T> {
  abstract extract(): Promise<T[]>;
  abstract store(data: T[]): Promise<boolean>;
}
