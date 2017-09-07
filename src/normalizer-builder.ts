import { ISchema, ISchemaConfig, Schema, UniqueKeyCallback } from '@normalized-db/core';
import { Normalizer } from './normalizer';

export class NormalizerBuilder {

  private schema: ISchema;
  private useReverseReferences: boolean;
  private uniqueKeyCallback: UniqueKeyCallback;

  public withSchema(schema: ISchema): NormalizerBuilder {
    this.schema = schema;
    return this;
  }

  public withSchemaConfig(schemaConfig: ISchemaConfig): NormalizerBuilder {
    this.schema = new Schema(schemaConfig);
    return this;
  }

  public withReverseReferences(useReverseReferences: boolean): NormalizerBuilder {
    this.useReverseReferences = useReverseReferences;
    return this;
  }

  public withUniqueKeyCallback(uniqueKeyCallback: UniqueKeyCallback): NormalizerBuilder {
    this.uniqueKeyCallback = uniqueKeyCallback;
    return this;
  }

  public get build(): Normalizer {
    return new Normalizer(this.schema, this.useReverseReferences, this.uniqueKeyCallback);
  }
}
