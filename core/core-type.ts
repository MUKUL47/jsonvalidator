import { Schema } from "../schema";
import { DataType, Type } from "../schema/type-core";

export type JsonValidatorProps = {
  schema: Type<DataType.OBJECT | DataType.ARRAY>;
};
