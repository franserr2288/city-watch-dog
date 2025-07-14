import type { DataSource } from 'src/lib/clients/socrata/socrata-constants';

export function constructConfigKey(
  useCase: ConfigTableUseCases,
  dataSource: DataSource,
) {
  return `${useCase.toString()}#${dataSource.toString()}`;
}
export enum ConfigTableUseCases {
  IntakeBatchingProgressCheckpoints = 'batch',
  IntakeBackfillCompleted = 'backfilled',
  ChangeDetectionLayer = 'updated',
}

export function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
