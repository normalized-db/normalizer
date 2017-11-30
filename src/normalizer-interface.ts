import { NormalizedData } from '@normalized-db/core';

export interface INormalizer {
  apply<T>(type: string, data: T | T[]): NormalizedData;
}
