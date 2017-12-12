export class Parent {

  constructor(public readonly key?: any,
              public readonly type?: string,
              public field?: string) {
  }

  public get isValid(): boolean {
    return this.key !== null;
  }
}
