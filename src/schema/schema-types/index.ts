import { DataType, TypeValue } from "../type-core";
import { IType } from "../type-core.interface";

export class Type<T extends DataType> implements IType {
  value: TypeValue<T>;
  constructor(type: DataType) {
    this.value = {
      type,
      required: false,
      customValidators: [],
    } as TypeValue<T>;
  }

  required(): this {
    this.value.required = true;
    return this;
  }

  example(v: any): this {
    this.value.example = v;
    return this;
  }

  addValidator(
    onValidate: (v: any) => boolean | Promise<boolean>,
    message?: string
  ) {
    if (typeof onValidate !== "function")
      throw new Error(
        "[addValidator] validator argument must be a function returning a boolean"
      );
    this.value.customValidators.push({
      message,
      onValidate,
    });
    return this;
  }

  errorMessage(m: string): this {
    this.value.customErrorMessage = m;
    return this;
  }
}

export * from "./any";
export * from "./array";
export * from "./string";
export * from "./number";
export * from "./object";
export * from "./boolean";
