import { Parent } from '../model/parent';
import { BasicNormalizer } from './basic-normalizer';

export class ReverseReferenceNormalizer extends BasicNormalizer {

  protected onNormalized(data: any, type: string, parent: Parent): number {
    const resultIndex = super.onNormalized(data, type, parent);
    data = this.result[type][resultIndex];

    if (parent && parent.isValid) {
      if (!data._refs) {
        data._refs = {};
      }

      if (parent.type in data._refs) {
        data._refs[parent.type].add(parent.key);
      } else {
        data._refs[parent.type] = new Set([parent.key]);
      }
    }

    return resultIndex;
  }
}
