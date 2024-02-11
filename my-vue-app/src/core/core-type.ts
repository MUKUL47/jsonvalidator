import { Schema } from "../schema";
import { DataType, Type } from "../schema/type-core";

export type SchemaValidatorProps = {
  schema: Type<DataType.OBJECT | DataType.ARRAY>;
};

export interface JSONObjectType {
  type: any;
  name?: string;
  key?: string;
  value?: any;
  children: JSONObjectType[];
  length?: number;
}

export enum ErrorType {
  Unexpected = "unexpected",
  Expected = "expected",
  MissingKeys = "missing_keys",
  MissingTypes = "missing_types",
}

export type ErrorControllerType = {
  type: ErrorType;
  key: String[];
  location: String;
  found?: String;
};
