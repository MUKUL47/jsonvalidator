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
} & (T extends DataType.STRING ? { shouldMatch?: RegExp[] } : {}) &
  (T extends DataType.OBJECT | DataType.ARRAY
    ? {
        children?: TypeData<DataType>[];
        nestedRequired?: undefined | boolean;
      }
    : {}) &
  (T extends DataType.ARRAY ? { min?: Number; max?: Number } : {}) &
  (T extends DataType.OBJECT ? { allowUnknown?: boolean } : {});

export type TypeData<T extends DataType> = {
  value: TypeValue<T> | null;
  name?: string;
};
