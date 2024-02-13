import { DataType, TypeValue } from "../type-core";
import { IType } from "../type-core.interface";

export class Type<T extends DataType> implements IType {
  value: TypeValue<T>;
  constructor(type: DataType) {
    this.value = {
      type,
      required: false,
    };
  }

  required(): this {
    this.value.required = true;
    return this;
  }

  example(v: any): this {
    this.value.example = v;
    return this;
  }
}

export * from "./any";
export * from "./array";
export * from "./string";
export * from "./number";
export * from "./object";
export * from "./boolean";
