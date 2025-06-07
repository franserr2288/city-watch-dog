import type { BatchResult } from 'src/lib/types/behaviors/pagination.ts';
import type { City311ApiClient } from './clients/socrata-311-api-client.ts';
import type { City311Report } from './validation/city-311-report-schema.ts';

interface IIntakeExtractor<T> {
  backfill(): AsyncGenerator<BatchResult<T>, void, unknown>;
  snapshot(): AsyncGenerator<BatchResult<T>, void, unknown>;
  detectChanges(): AsyncGenerator<BatchResult<T>, void, unknown>;
}

export default class City311Extractor
  implements IIntakeExtractor<City311Report>
{
  constructor(private socrataApiClient: City311ApiClient) {}
  detectChanges(): AsyncGenerator<BatchResult<City311Report>, void, unknown> {
    throw new Error('Method not implemented.');
  }

  public async *backfill(): AsyncGenerator<
    BatchResult<City311Report>,
    void,
    unknown
  > {
    for await (const chunk of this.socrataApiClient.getBackfillBatches()) {
      console.log(chunk);
      yield chunk;
    }
  }
  public async *snapshot(): AsyncGenerator<
    BatchResult<City311Report>,
    void,
    unknown
  > {
    for await (const chunk of this.socrataApiClient.getSnapshotBatches()) {
      console.log(chunk);
      yield chunk;
    }
  }

  // public async *detectChanges(): AsyncGenerator<
  //   BatchResult<City311Report>,
  //   void,
  //   unknown
  // > {
  //   const updatedAndNewRecords = await this.socrataApiClient.detectChanges();
  //   return updatedAndNewRecords;
  // }
}
