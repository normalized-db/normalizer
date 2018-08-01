import { ISchema, isNull, KeyMap, NormalizedData, UniqueKeyCallback } from '@normalized-db/core';
import { BasicNormalizer } from './implementation/basic-normalizer';
import { ReverseReferenceNormalizer } from './implementation/reverse-reference-normalizer';
import { INormalizer } from './normalizer-interface';

export class Normalizer implements INormalizer {

  private _keyMap: KeyMap;

  constructor(private readonly _schema: ISchema,
              private readonly _useReverseReferences: boolean = false,
              private readonly _uniqueKeyCallback?: UniqueKeyCallback) {
    if (isNull(_schema)) {
      throw new Error('Cannot create a normalizer without a schema');
    }
  }

  public async apply<T>(type: string, data: T | T[]): Promise<NormalizedData> {
    const implementation = this.createImplementation();
    const result = await implementation.apply(type, data);
    this._keyMap = implementation.getKeyMap();
    return result;
  }

  public getUniqueKeyCallback(): UniqueKeyCallback {
    return this._uniqueKeyCallback;
  }

  public getKeyMap(): KeyMap {
    return this._keyMap;
  }

  private createImplementation(): INormalizer {
    return this._useReverseReferences
      ? new ReverseReferenceNormalizer(this._schema, this._uniqueKeyCallback)
      : new BasicNormalizer(this._schema, this._uniqueKeyCallback);
  }
}
