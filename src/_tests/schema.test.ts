import { JsonValidator, Schema as S } from "..";

describe("Schema", () => {
  it("must not return any errors", () => {
    const validator = new JsonValidator({
      schema: S.array(),
    });
    expect(validator).toBeTruthy();
  });
  it("should return error for multiple duplicate types in array schema", () => {
    expect(
      () =>
        new JsonValidator({
          schema: S.array(S.string(), S.string()),
        })
    ).toThrow("[ArrayType] duplicate types not allowed in array : string");
  });
  it("should throw error if validating any except array or object", () => {
    expect(
      () =>
        new JsonValidator({
          schema: S.any(),
        })
    ).toThrow("Can only validate Object(s) or Array(s)");

    expect(
      () =>
        new JsonValidator({
          schema: S.string(),
        })
    ).toThrow("Can only validate Object(s) or Array(s)");
  });
});
