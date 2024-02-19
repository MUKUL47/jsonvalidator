import { Type } from "../schema/schema-types";
import { DataType, TypeValue } from "../schema/type-core";

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
  Exception = "exception",
  StringRegexMissmatch = "string_regex_missmatch",
  NumberMinExpected = "number_min_length",
  NumberMaxExpected = "number_max_length",
  CustomValidation = "custom_validation",
}

export type ErrorControllerType = {
  type?: ErrorType;
  key?: String[];
  location?: String;
  found?: String;
  message?: any;
  example?: any;
};

export type CheckType<T extends DataType> = {
  type: TypeValue<T>;
  child: JSONObjectType;
  key_index: string;
  prefix: string;
};
