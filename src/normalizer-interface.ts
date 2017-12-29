import { KeyMap, NormalizedData, UniqueKeyCallback } from '@normalized-db/core';

export interface INormalizer {
  apply<T>(type: string, data: T | T[]): NormalizedData;

  getUniqueKeyCallback(): UniqueKeyCallback;

  getKeyMap(): KeyMap;
}
