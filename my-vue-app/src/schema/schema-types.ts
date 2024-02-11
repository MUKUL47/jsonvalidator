import { DataType, Type, TypeData, TypeValue } from "./type-core";

class ObjectType extends Type<DataType.OBJECT> {
  constructor(records: Partial<Record<any, Type<DataType>>> = {}) {
    super(DataType.OBJECT);
    if (typeof records !== "object") {
      throw new Error("[ObjectType] only accept object argument(s)");
    }
    const children: TypeData<DataType>[] = [];
    // const values = Object.values(records);
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
  shouldMatch(reg: RegExp): this {
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
    this.value.children = children;
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

export { AnyType, ArrayType, ObjectType, NumberType, StringType, BooleanType };
