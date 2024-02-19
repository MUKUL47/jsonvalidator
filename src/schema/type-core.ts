export enum DataType {
  STRING = "string",
  NUMBER = "number",
  OBJECT = "object",
  ANY = "any",
  ARRAY = "array",
  BOOLEAN = "boolean",
}
export type DataTypeKeys = (typeof DataType)[keyof typeof DataType];
export type TypeValue<T extends DataType> = {
  type: DataType;
  required: undefined | boolean;
  example?: any;
  name?: string;
  customValidators?: CustomValidators[];
  customErrorMessage?: string;
} & ExtendType<T>;

export type TypeData<T extends DataType> = {
  value: TypeValue<T> | null;
  name?: string;
};

export type ExtendType<T extends DataType> = T extends DataType.STRING
  ? StringType
  : T extends DataType.OBJECT
  ? RecordType & ObjectType
  : T extends DataType.ARRAY
  ? ObjectType & ArrayType
  : never;

type StringType = { shouldMatch?: RegExp[] };
type ArrayType = { min?: Number; max?: Number };
type RecordType = { allowUnknown?: boolean };
type ObjectType = {
  children?: TypeData<DataType>[];
  nestedRequired?: undefined | boolean;
};

type CustomValidators = {
  message?: string;
  onValidate?: (v: any) => boolean | Promise<boolean>;
};
