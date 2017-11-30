import { ISchema, ISchemaConfig, Schema, UniqueKeyCallback } from '@normalized-db/core';
import { Normalizer } from '../normalizer';
import { INormalizerBuilder } from './normalizer.builder-interface';

export class NormalizerBuilder implements INormalizerBuilder {

  private _schema: ISchema;
  private _useReverseReferences: boolean;
  private _uniqueKeyCallback: UniqueKeyCallback;

  public schema(schema: ISchema): NormalizerBuilder {
    this._schema = schema;
    return this;
  }

  public schemaConfig(schemaConfig: ISchemaConfig): NormalizerBuilder {
    this._schema = new Schema(schemaConfig);
    return this;
  }

  public reverseReferences(useReverseReferences: boolean): NormalizerBuilder {
    this._useReverseReferences = useReverseReferences;
    return this;
  }

  public uniqueKeyCallback(uniqueKeyCallback: UniqueKeyCallback): NormalizerBuilder {
    this._uniqueKeyCallback = uniqueKeyCallback;
    return this;
  }

  public build(): Normalizer {
    return new Normalizer(this._schema, this._useReverseReferences, this._uniqueKeyCallback);
  }
}
