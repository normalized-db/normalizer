export class Parent {

  constructor(public key?: any,
              public type?: string,
              public field?: string) {
  }

  public get isValid(): boolean {
    return this.key !== null;
  }
}
