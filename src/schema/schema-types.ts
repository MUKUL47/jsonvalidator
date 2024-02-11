import { DataType, Type, TypeData } from "./type-core";

class ObjectType extends Type<DataType.OBJECT> {
  constructor(records: Partial<Record<any, Type<DataType>>> = {}) {
    super(DataType.OBJECT);
    if (typeof records !== "object") {
      throw new Error("[ObjectType] only accept object argument(s)");
    }
    const children: TypeData<DataType>[] = [];
    for (let k in records) {
      children.push({ ...records[k], name: k } as TypeData<any>);
    }
    this.value.children = children as TypeData<any>[];
  }
  allowUnknown(): this {
    this.value.allowUnknown = true;
    return this;
  }
}
class StringType extends Type<DataType.STRING> {
  constructor() {
    super(DataType.STRING);
  }
  shouldMatch(...reg: RegExp[]): this {
    this.value.shouldMatch = reg;
    return this;
  }
}
class NumberType extends Type<DataType.NUMBER> {
  constructor() {
    super(DataType.NUMBER);
  }
}
class AnyType extends Type<DataType.ANY> {
  constructor() {
    super(DataType.ANY);
  }
}
class ArrayType extends Type<DataType.ARRAY> {
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
}
class BooleanType extends Type<DataType.BOOLEAN> {
  constructor() {
    super(DataType.BOOLEAN);
  }
}

export { AnyType, ArrayType, BooleanType, NumberType, ObjectType, StringType };
