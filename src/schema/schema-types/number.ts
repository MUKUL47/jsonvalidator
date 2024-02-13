import { Type } from ".";
import { DataType } from "../type-core";

export class NumberType extends Type<DataType.NUMBER> {
  constructor() {
    super(DataType.NUMBER);
  }
}
