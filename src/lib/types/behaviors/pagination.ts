export interface City311PaginationCursor {
  createddate: string;
  srnumber: string;
}

export interface BatchResult<T> {
  data: Array<T>;
  cursor: City311PaginationCursor | null;
  hasMore: boolean;
  batchNumber: number;
  totalRecordsProcessed: number;
}

export interface CheckpointData<TCursorType> {
  cursor: TCursorType | null;
  totalRecordsProcessed: number;
  lastUpdated: string;
  operationType: 'snapshot' | 'backfill' | 'incremental';
}

export interface CheckpointManager<TCursorType> {
  getCheckpoint(
    operationType: string,
  ): Promise<CheckpointData<TCursorType> | null>;
  saveCheckpoint(
    operationType: string,
    checkpoint: CheckpointData<TCursorType>,
  ): Promise<void>;
  clearCheckpoint(operationType: string): Promise<void>;
}

export interface ConfigTableExpectedShape<T> {
  config_key: string;
  data: T;
}
