import { NormalizedData } from '@normalized-db/core';

export interface INormalizer {
  apply<T>(data: T | T[], type: string): NormalizedData;
}
