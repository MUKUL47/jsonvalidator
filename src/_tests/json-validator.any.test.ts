import { JsonValidator as J } from "../core/json-validator";
import { Schema as S } from "../schema";
describe("JSONValidator -> DataType : ANY", () => {
  it("should allow any type for any schema reference", () => {
    const schema = S.object({
      name: S.string().required(),
      value: S.any().required(),
    });
    expect(() =>
      new J({ schema, throwError: true }).validate({
        name: "",
        value: [{ a: { v: 2 } }],
      })
    ).not.toThrow();
  });
  it("should allow any type for any schema reference", () => {
    const schema = S.object({
      name: S.string().required(),
      values: S.array(
        S.array(
          S.array(
            S.array(S.any().required(), S.boolean().required()).required(),
            S.object({
              someNumber: S.number().required(),
              someString: S.string().required(),
              nestedArray: S.array(
                S.object({
                  nestedBoolean: S.boolean().required(),
                  nestedString: S.string().required(),
                  nestedNumber: S.number().required(),
                  nestedObject: S.object({
                    deeplyNestedString: S.string().required(),
                    deeplyNestedNumber: S.number().required(),
                  }).required(),
                }).required()
              ).required(),
            }).required()
          ).required(),
          S.string().required()
        ).required()
      ).required(),
      isActive: S.boolean().required(),
      count: S.number().required(),
      anyValue: S.any().required(),
    }).required();
    expect(() =>
      new J({ schema, throwError: true }).validate({
        name: "John Doe",
        values: [
          [
            [
              [true, "example"],
              {
                someNumber: 42,
                someString: "nested",
                nestedArray: [
                  {
                    nestedBoolean: false,
                    nestedString: "inner",
                    nestedNumber: 3.14,
                    nestedObject: {
                      deeplyNestedString: "hello",
                      deeplyNestedNumber: 7,
                    },
                  },
                ],
              },
            ],
            "secondString",
          ],
        ],
        isActive: true,
        count: 10,
        anyValue: "This is any value",
      })
    ).not.toThrow();
  });
});
