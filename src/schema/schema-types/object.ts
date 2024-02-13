import { Type } from ".";
import { DataType, TypeData } from "../type-core";
import { INestedRequired, IObjectType } from "../type-core.interface";

export class ObjectType
  extends Type<DataType.OBJECT>
  implements IObjectType, INestedRequired
{
  constructor(records: Partial<Record<any, Type<DataType>>> = {}) {
    super(DataType.OBJECT);
    if (typeof records !== "object" || Array.isArray(records)) {
      throw new Error("[ObjectType] only accept object argument(s)");
    }
    const children: TypeData<DataType>[] = [];
    for (let k in records) {
      children.push({ ...records[k], name: k } as TypeData<any>);
    }
    this.value.children = children as TypeData<any>[];
  }
  allowUnknown() {
    this.value.allowUnknown = true;
    return this;
  }

  setNestedRequired() {
    this.value.nestedRequired = true;
    return this;
  }
}
