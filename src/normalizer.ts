import { ISchema, isNull, NormalizedData, UniqueKeyCallback } from '@normalized-db/core';
import { BasicNormalizer } from './implementation/basic-normalizer';
import { ReverseReferenceNormalizer } from './implementation/reverse-reference-normalizer';
import { INormalizer } from './normalizer-interface';

export class Normalizer implements INormalizer {

  constructor(private readonly _schema: ISchema,
              private readonly _useReverseReferences: boolean = false,
              private readonly _uniqueKeyCallback?: UniqueKeyCallback) {
    if (isNull(_schema)) {
      throw new Error('Cannot create a normalizer without a schema');
    }
  }

  public apply<T>(type: string, data: T | T[]): NormalizedData {
    return this.getImplementation().apply(type, data);
  }

  public getUniqueKeyCallback(): UniqueKeyCallback {
    return this._uniqueKeyCallback;
  }

  private getImplementation(): INormalizer  {
    return this._useReverseReferences
      ? new ReverseReferenceNormalizer(this._schema, this._uniqueKeyCallback)
      : new BasicNormalizer(this._schema, this._uniqueKeyCallback);
  }
}
