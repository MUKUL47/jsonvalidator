import { Type } from ".";
import { DataType } from "../type-core";

export class BooleanType extends Type<DataType.BOOLEAN> {
  constructor() {
    super(DataType.BOOLEAN);
  }
}
