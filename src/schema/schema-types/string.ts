import { Type } from ".";
import { DataType } from "../type-core";
import { IStringType } from "../type-core.interface";

export class StringType extends Type<DataType.STRING> implements IStringType {
  constructor() {
    super(DataType.STRING);
  }
  shouldMatch(...reg: RegExp[]): this {
    this.value.shouldMatch = reg;
    return this;
  }
}
