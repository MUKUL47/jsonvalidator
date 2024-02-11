import { ErrorControllerType, ErrorType } from "./core-type";
export class ErrorController {
  type: ErrorType;
  key: String[];
  location: String;
  found?: String;
  static readonly ErrorTypeMap = {
    [ErrorType.Expected]: "Expected",
    [ErrorType.MissingKeys]: "Missing key(s)",
    [ErrorType.MissingTypes]: "Missing type(s)",
    [ErrorType.Unexpected]: "Unexpected",
  };
  message: string;
  constructor({ key, location, type, found }: ErrorControllerType) {
    this.key = key;
    this.location = location;
    this.type = type;
    this.found = found;
    this.message = this.generateErrorMessage();
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
    }
  }
}
