import { Type } from "./schema-types";
import { AnyType } from "./schema-types/any";
import { ArrayType } from "./schema-types/array";
import { BooleanType } from "./schema-types/boolean";
import { NumberType } from "./schema-types/number";
import { ObjectType } from "./schema-types/object";
import { StringType } from "./schema-types/string";
import { DataType, TypeData } from "./type-core";

export default class Schema {
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