import { DataType, TypeValue } from "../schema/type-core";
import { ErrorControllerType, ErrorType } from "./core-type";
export class ErrorController {
  type: ErrorType;
  key: String[];
  location: String;
  found?: String | null;
  static readonly ErrorTypeMap: Record<Partial<ErrorType>, String> = {
    [ErrorType.Expected]: "Expected",
    [ErrorType.MissingKeys]: "Missing key(s)",
    [ErrorType.MissingTypes]: "Missing type(s)",
    [ErrorType.Unexpected]: "Unexpected",
    [ErrorType.Exception]: "Exception",
    [ErrorType.StringRegexMissmatch]: "String regex invalid",
    [ErrorType.NumberMaxExpected]: "Array length should be at most",
    [ErrorType.NumberMinExpected]: "Array length should be at least",
  };
  example: any;
  message: string;
  schemaType?: TypeValue<DataType> | null;
  constructor(
    errorProps: ErrorControllerType,
    typevalue?: TypeValue<DataType>
  ) {
    const { key, location, type, found, example } = errorProps;
    this.key = key;
    this.location = location;
    this.type = type;
    this.found = found || null;
    this.example = example || null;
    this.schemaType = typevalue || null;
    this.message =
      errorProps.hasOwnProperty("message") && !!errorProps?.message
        ? errorProps.message
        : this.generateErrorMessage();
  }

  private generateErrorMessage() {
    const msg = ErrorController.ErrorTypeMap[this.type];
    switch (this.type) {
      case ErrorType.MissingKeys:
      case ErrorType.MissingTypes:
        return `${msg} ${this.key.join(", ")} for ${this.location}`;
      case ErrorType.Expected:
        return `${msg} ${this.key.join(" or ")} but found ${
          this.found || "${}"
        } at ${this.location}`;
      case ErrorType.Unexpected:
        return `${msg} ${this.key.join(", ")} at ${this.location}`;
      case ErrorType.Exception:
        return `${msg} occurred`;
      case ErrorType.StringRegexMissmatch:
        return `${msg} for ${this.key[0] || "{$}"} at ${this.location}`;
      case ErrorType.NumberMaxExpected:
      case ErrorType.NumberMinExpected: {
        const schemaType = this.schemaType as TypeValue<DataType.ARRAY>;
        const expectedLength =
          this.type === ErrorType.NumberMaxExpected
            ? schemaType.max
            : schemaType.min;
        return `${msg} ${expectedLength} for ${this.key[0] || "{$}"} at ${
          this.location
        }`;
      }
      default:
        return "Unknown error";
    }
  }
}
