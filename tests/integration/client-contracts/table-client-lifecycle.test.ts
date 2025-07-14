import { ServiceRequestTableClient } from 'src/lib/clients/infrastructure/table/base/table-client';
import { getEnvVar } from 'src/lib/config/env';
import { samplePayload } from '../../data/lib/clients/sample-object';
import { beforeEach, describe, it } from 'node:test';
import type { ServiceRequest } from 'src/lib/types/models/service-request';

describe('TableStorageClient Lifecycle', () => {
  let tableClient: ServiceRequestTableClient;

  beforeEach(() => {
    tableClient = new ServiceRequestTableClient(
      getEnvVar('DAILY_SNAPSHOT_BUCKET'),
    );
  });

  it('should complete full data lifecycle: store and retrieve', async () => {
    await tableClient.save([samplePayload]);

    const retrievedData = await tableClient.getCity311Data([
      samplePayload.sr_number,
    ]);

    expect(retrievedData).toHaveLength(1);
    expect(retrievedData[0]).toEqual(samplePayload);
    expect(retrievedData[0].sr_number).toBe(samplePayload.sr_number);
  });

  it('should handle multiple records in lifecycle', async () => {
    const multiplePayloads = [
      samplePayload,
      { ...samplePayload, sr_number: 'SR2024-456' } as ServiceRequest,
    ];

    await tableClient.save(multiplePayloads);

    const srNumbers = multiplePayloads.map((p) => p.sr_number);
    const retrievedData = await tableClient.getCity311Data(srNumbers);

    expect(retrievedData).toHaveLength(2);
    expect(retrievedData).toEqual(expect.arrayContaining(multiplePayloads));
  });

  it('should handle retrieval of non-existent records', async () => {
    const nonExistentData = await tableClient.getCity311Data([
      'NON-EXISTENT-123',
    ]);

    expect(nonExistentData).toHaveLength(0);
  });
});
