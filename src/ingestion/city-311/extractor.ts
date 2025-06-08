import type { BatchResult } from 'src/lib/types/behaviors/pagination.ts';
import type { City311ApiClient } from './clients/socrata-311-api-client.ts';
import { MyLA311ServiceRequest } from 'src/lib/types/models/city-311-report.ts';
import type { City311Report } from './clients/city-311-report-schema.ts';

interface IIntakeExtractor<T> {
  backfill(): AsyncGenerator<Array<T>, void, unknown>;
  snapshot(): AsyncGenerator<Array<T>, void, unknown>;
  detectChanges(): AsyncGenerator<Array<T>, void, unknown>;
}

export default class City311Extractor
  implements IIntakeExtractor<MyLA311ServiceRequest>
{
  constructor(private socrataApiClient: City311ApiClient) {}

  public async *backfill(): AsyncGenerator<
    Array<MyLA311ServiceRequest>,
    void,
    unknown
  > {
    yield* this.mapToAppLayerModels(this.socrataApiClient.getBackfillBatches());
  }
  public async *snapshot(): AsyncGenerator<
    Array<MyLA311ServiceRequest>,
    void,
    unknown
  > {
    yield* this.mapToAppLayerModels(this.socrataApiClient.getSnapshotBatches());
  }

  private async *mapToAppLayerModels(
    apiLayer: AsyncGenerator<BatchResult<City311Report>, void, unknown>,
  ): AsyncGenerator<Array<MyLA311ServiceRequest>, void, unknown> {
    for await (const layer of apiLayer) {
      yield layer.data.map((i) => MyLA311ServiceRequest.fromAPIJSON(i));
    }
  }

  public async *detectChanges(): AsyncGenerator<
    Array<MyLA311ServiceRequest>,
    void,
    unknown
  > {
    yield* this.mapToAppLayerModels(
      this.socrataApiClient.getNewAndUpdatedRecordsSinceLastCheck(null, false),
    );
  }
}
