import {
  deepClone, InvalidTypeError, ISchema, isNull, isObject, IStore, IStoreTargetItem, KeyMap, MissingKeyError,
  NormalizedData, TypeMismatchError, UniqueKeyCallback, ValidKey
} from '@normalized-db/core';
import { Parent } from '../model/parent';
import { INormalizer } from '../normalizer-interface';

export class BasicNormalizer implements INormalizer {

  protected readonly _result: NormalizedData = {};
  protected readonly _keyMap: KeyMap = {};

  constructor(protected readonly _schema: ISchema,
              protected readonly _uniqueKeyCallback?: UniqueKeyCallback) {
    this.onNormalizedSimpleType = this.onNormalizedSimpleType.bind(this);
    this.onNormalizedKeyedType = this.onNormalizedKeyedType.bind(this);

    if (isNull(this._uniqueKeyCallback)) {
      this.nextKey = this.nextKey.bind(this);
      this._uniqueKeyCallback = this.nextKey;
    }
  }

  public apply(type: string, data: any): NormalizedData {
    this.applyHelper(deepClone(data), { type: type }, null, true);
    return this._result;
  }

  public getUniqueKeyCallback(): UniqueKeyCallback {
    return this._uniqueKeyCallback;
  }

  public getKeyMap(): KeyMap {
    return this._keyMap;
  }

  protected applyHelper(data: any,
                        target: IStoreTargetItem,
                        parent = new Parent(),
                        isRoot: boolean = false): any | any[] {
    this.validateType(target.type);

    if (isNull(data)) {
      return null;
    } else if (Array.isArray(data)) {
      return this.normalizeArray(data, target, parent, isRoot);
    } else if (isObject(data)) {
      return this.normalizeObject(data, target, parent);
    } else {
      return data;
    }
  }

  protected normalizeArray(data: any[], target: IStoreTargetItem, parent: Parent, isRoot: boolean) {
    return data.map(item => this.normalizeObject(item, target, parent, !isRoot));
  }

  protected normalizeObject(data: any, target: IStoreTargetItem, parent: Parent, isArray: boolean = false) {
    this.isArrayTypeValid(target, parent, isArray);
    if (!isObject(data) || data instanceof Date) {
      return data; // `data` is already normalized
    }

    const config = this._schema.getConfig(target.type);
    if (isNull(data[config.key])) {
      if (!config.autoKey) {
        throw new MissingKeyError(target.type, config.key);
      }

      data[config.key] = this._uniqueKeyCallback(target.type);
    }

    if (!isNull(config.targets)) {
      this.normalizeTargets(data, target.type, config);
    }

    this.onNormalized(data, target.type, parent);
    return isNull(config.key) ? data : data[config.key];
  }

  protected isArrayTypeValid(target: IStoreTargetItem, parent: Parent, isArray: boolean) {
    if (target.isArray) {
      if (!isArray) {
        throw new TypeMismatchError(parent.type, parent.field, true);
      }
    } else if (isArray) {
      throw new TypeMismatchError(parent.type, parent.field, false);
    }
  }

  protected normalizeTargets(data: any, type: string, config: IStore) {
    const childParent = new Parent(data[config.key], type);
    Object.keys(config.targets)
      .filter(field => field in data)
      .forEach(field => {
        childParent.field = field;
        data[field] = this.applyHelper(data[field], config.targets[field], childParent, false);
      });
  }

  protected onNormalized(data: any, type: string, parent: Parent): number {
    const config = this._schema.getConfig(type);
    const onNormalizedFunction = isNull(config.key)
      ? this.onNormalizedSimpleType
      : this.onNormalizedKeyedType;

    return onNormalizedFunction(data, type, config);
  }

  protected onNormalizedKeyedType(data: any, type: string, config: IStore): number {
    const newKey = data[config.key];
    if (type in this._result) {
      // push only if key is unknown or element was not pushed previously
      const keyMap = this._keyMap[type];
      if (keyMap.has(newKey)) {
        return keyMap.get(newKey);
      } else {
        keyMap.set(newKey, this._result[type].length);
        this._result[type].push(data);
      }

    } else {
      this._keyMap[type] = new Map([[newKey, 0]]);
      this._result[type] = [data];
    }

    return this._result[type].length - 1;
  }

  protected nextKey(type: string): ValidKey {
    // https://stackoverflow.com/a/2117523/3863059
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  protected onNormalizedSimpleType(data: any, type: string): number {
    if (type in this._result) {
      this._result[type].push(data);
    } else {
      this._result[type] = [data];
    }

    return this._result[type].length - 1;
  }

  protected validateType(type: string) {
    if (!this._schema.hasType(type)) {
      throw new InvalidTypeError(type);
    }
  }
}
