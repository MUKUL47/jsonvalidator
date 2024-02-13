import { Type } from "./schema-types";
import { DataType } from "./type-core";
export interface INestedRequired {
  setNestedRequired(): Type<DataType.OBJECT | DataType.ARRAY>;
}
export interface IObjectType {
  allowUnknown(): Type<DataType.OBJECT>;
}

export interface IStringType {
  shouldMatch(...reg: RegExp[]): Type<DataType.STRING>;
}

export interface IArrayType {
  min(n: Number): Type<DataType.ARRAY>;
  max(n: Number): Type<DataType.ARRAY>;
}

export interface IType {
  required(): Type<any>;
  example(v: any): Type<any>;
}
