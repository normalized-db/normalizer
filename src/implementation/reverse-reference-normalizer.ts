import { NdbDocument } from '@normalized-db/core';
import { ValidKey } from '@normalized-db/core/lib/src/model/valid-key';
import { Parent } from '../model/parent';
import { BasicNormalizer } from './basic-normalizer';

export class ReverseReferenceNormalizer extends BasicNormalizer {

  protected onNormalized(data: NdbDocument, type: string, parent: Parent): number {
    const resultIndex = super.onNormalized(data, type, parent);
    data = this._result[type][resultIndex];

    if (parent && parent.isValid) {
      if (!data._refs) {
        Object.assign(data, { _refs: {} });
      }

      if (parent.type in data._refs) {
        data._refs[parent.type].add(parent.key);
      } else {
        data._refs[parent.type] = new Set<ValidKey>([parent.key]);
      }
    }

    return resultIndex;
  }
}
