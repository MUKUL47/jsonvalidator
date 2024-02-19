import { JsonValidator as J } from "../core/json-validator";
import { Schema as S } from "../schema";
describe("JSONValidator: Custom validator", () => {
  it("should validate custom validator and throw for invalid value", () => {
    const schema = S.object({
      name: S.string()
        .required()
        .addValidator((v) => {
          return v.includes("john doe");
        }, "Name must be john doe")
        .addValidator((v) => {
          return v.length < 9;
        }, "Name length must be less than 9"),
      arr: S.array(
        S.string()
          .required()
          .addValidator(
            (v) => !v.includes(" "),
            "string inside array must not contain any spaces"
          ),
        S.number()
          .required()
          .example(2)
          .addValidator((v) => v % 2 === 0, "Number must be prime!")
      )
        .required()
        .min(5),
    }).allowUnknown();
    expect(() =>
      new J({ schema, throwError: true }).validate({
        name: "asd",
      })
    ).toThrow(/Name must be john doe/);
    expect(() =>
      new J({ schema, throwError: true }).validate({
        name: "john doe                            ",
      })
    ).toThrow(/Name length must be less than 9/);
    expect(() =>
      new J({ schema, throwError: true }).validate({
        name: "john doe",
        arr: ["  ", "", "", "", 2, 4, 4, 2, ""],
      })
    ).toThrow(/string inside array must not contain any spaces/);

    expect(() =>
      new J({ schema, throwError: true }).validate({
        name: "john doe",
        arr: ["", "", "", 1, ""],
      })
    ).toThrow(/Number must be prime!/);
  });
});
