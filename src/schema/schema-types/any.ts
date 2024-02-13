import { Type } from ".";
import { DataType } from "../type-core";

export class AnyType extends Type<DataType.ANY> {
  constructor() {
    super(DataType.ANY);
  }
}
