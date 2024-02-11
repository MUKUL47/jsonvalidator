import { DataType, Type } from "../schema/type-core";

export type ValidatorProps = {
  schema: Type<DataType.OBJECT | DataType.ARRAY>;
  throwError?: boolean;
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
