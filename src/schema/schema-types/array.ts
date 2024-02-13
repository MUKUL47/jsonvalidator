import { Type } from ".";
import { AnyType } from "../schema-types";
import { DataType, TypeData } from "../type-core";
import { IArrayType, INestedRequired } from "../type-core.interface";

export class ArrayType
  extends Type<DataType.ARRAY>
  implements INestedRequired, IArrayType
{
  constructor(children: TypeData<DataType>[] = []) {
    super(DataType.ARRAY);
    this.value.children = children.length === 0 ? [new AnyType()] : children;
    const duplicateMap = new Map<DataType, true>();
    if (children.length > 1) {
      children.forEach((child) => {
        if (duplicateMap.has(child.value?.type as DataType)) {
          throw new Error(
            `[ArrayType] duplicate types not allowed in array : ${child.value?.type}`
          );
        }
        duplicateMap.set(child.value?.type as DataType, true);
      });
    }
  }

  min(min: Number): this {
    this.value.min = min;
    return this;
  }
  max(max: Number): this {
    this.value.max = max;
    return this;
  }

  setNestedRequired(): this {
    this.value.nestedRequired = true;
    return this;
  }
}
