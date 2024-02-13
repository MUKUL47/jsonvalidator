import { Type } from "./schema-types";
import {
  AnyType,
  ArrayType,
  BooleanType,
  NumberType,
  ObjectType,
  StringType,
} from "./schema-types";
import { DataType, TypeData } from "./type-core";

class Schema {
  static string() {
    return new StringType();
  }
  static object(records: Partial<Record<any, Type<DataType>>>) {
    return new ObjectType(records);
  }
  static number() {
    return new NumberType();
  }
  static any() {
    return new AnyType();
  }
  static boolean() {
    return new BooleanType();
  }
  static array(...children: TypeData<DataType>[]) {
    return new ArrayType(children);
  }
}
export { Schema };
