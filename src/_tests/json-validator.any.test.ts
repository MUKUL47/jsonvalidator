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
      name: S.string(),
      values: S.array(
        S.array(
          S.array(
            S.array(S.any(), S.boolean()),
            S.object({
              someNumber: S.number(),
              someString: S.string(),
              nestedArray: S.array(
                S.object({
                  nestedBoolean: S.boolean(),
                  nestedString: S.string(),
                  nestedNumber: S.number(),
                  nestedObject: S.object({
                    deeplyNestedString: S.string(),
                    deeplyNestedNumber: S.number(),
                  }),
                })
              ),
            })
          ),
          S.string()
        )
      ),
      isActive: S.boolean(),
      count: S.number(),
      anyValue: S.any(),
    }).setNestedRequired();
    expect(() =>
      new J({ schema, throwError: true }).validate({
        name: "John Doe",
        values: [
          [
            [
              [true],
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
