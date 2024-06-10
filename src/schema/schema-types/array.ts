import { Type } from ".";
import { DataType, TypeData } from "../type-core";
import { IArrayType, INestedRequired } from "../type-core.interface";
import { AnyType } from "./any";

export class ArrayType
  extends Type<DataType.ARRAY>
  implements INestedRequired, IArrayType
{
  constructor(children: TypeData<DataType>[] = []) {
    super(DataType.ARRAY);
    this.value.children = children.length === 0 ? [new AnyType()] : children;
    if (children.length > 1) {
      const duplicateMap = new Set<DataType>();
      children.forEach((child) => {
        if (duplicateMap.has(child.value?.type as DataType)) {
          throw new Error(
            `[ArrayType] duplicate types not allowed in array : ${child.value?.type}`
          );
        }
        duplicateMap.add(child.value?.type as DataType);
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
