import type { BatchResult } from 'src/lib/types/behaviors/pagination';
import { MyLA311ServiceRequest } from 'src/lib/types/models/city-311-report';
import type { City311Report } from '../city-311/validation/city-311-report-schema';

export async function* mapToStorageLayerModels(
  apiLayer: AsyncGenerator<BatchResult<City311Report>, void, unknown>,
): AsyncGenerator<Array<MyLA311ServiceRequest>, void, unknown> {
  for await (const layer of apiLayer) {
    yield layer.data.map((i) => MyLA311ServiceRequest.fromAPIJSON(i));
  }
}
