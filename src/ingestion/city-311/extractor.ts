import type { City311ApiClient } from './clients/socrata-311-api-client.ts';
import type { City311ExternalModel } from './clients/city-311-report-schema.ts';
import type {
  BatchResult,
  City311PaginationCursor,
} from 'src/lib/types/behaviors/pagination.ts';
import { ServiceRequest } from 'src/lib/types/models/service-request.ts';

interface IIntakeExtractor<T, K> {
  backfill(lastCheck: K | null): AsyncGenerator<Array<T>, void, unknown>;
  snapshot(lastCheck: K | null): AsyncGenerator<Array<T>, void, unknown>;
  detectChanges(): AsyncGenerator<Array<T>, void, unknown>;
}

export default class City311Extractor
  implements IIntakeExtractor<ServiceRequest, City311PaginationCursor>
{
  constructor(private socrataApiClient: City311ApiClient) {}

  public async *backfill(
    lastCheck: City311PaginationCursor | null,
  ): AsyncGenerator<Array<ServiceRequest>, void, unknown> {
    yield* this.mapToAppLayerModels(
      this.socrataApiClient.getBackfillBatches(lastCheck),
    );
  }
  public async *snapshot(
    lastCheck: City311PaginationCursor | null,
  ): AsyncGenerator<Array<ServiceRequest>, void, unknown> {
    yield* this.mapToAppLayerModels(
      this.socrataApiClient.getSnapshotBatches(lastCheck),
    );
  }

  private async *mapToAppLayerModels(
    apiLayer: AsyncGenerator<BatchResult<City311ExternalModel>, void, unknown>,
  ): AsyncGenerator<Array<ServiceRequest>, void, unknown> {
    for await (const layer of apiLayer) {
      yield layer.data.map((i) => ServiceRequest.fromAPIJSON(i));
    }
  }

  public async *detectChanges(): AsyncGenerator<
    Array<ServiceRequest>,
    void,
    unknown
  > {
    yield* this.mapToAppLayerModels(
      this.socrataApiClient.getNewAndUpdatedRecordsSinceLastCheck(null, false),
    );
  }
}
