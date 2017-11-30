import { ISchema, isNull, NormalizedData, UniqueKeyCallback } from '@normalized-db/core';
import { BasicNormalizer } from './implementation/basic-normalizer';
import { ReverseReferenceNormalizer } from './implementation/reverse-reference-normalizer';
import { INormalizer } from './normalizer-interface';

export class Normalizer implements INormalizer {

  constructor(private readonly schema: ISchema,
              private readonly useReverseReferences: boolean = false,
              private readonly uniqueKeyCallback?: UniqueKeyCallback) {
    if (isNull(schema)) {
      throw new Error('Cannot create a normalizer without a schema');
    }
  }

  public apply<T>(type: string, data: T | T[]): NormalizedData {
    return this.getImplementation().apply(type, data);
  }

  private getImplementation(): INormalizer  {
    return this.useReverseReferences
      ? new ReverseReferenceNormalizer(this.schema, this.uniqueKeyCallback)
      : new BasicNormalizer(this.schema, this.uniqueKeyCallback);
  }
}
