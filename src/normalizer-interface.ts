import { KeyMap, NdbDocument, NormalizedData, UniqueKeyCallback } from '@normalized-db/core';

export interface INormalizer {
  apply<T extends NdbDocument>(type: string, data: T | T[]): Promise<NormalizedData>;

  getUniqueKeyCallback(): UniqueKeyCallback;

  getKeyMap(): KeyMap;
}
