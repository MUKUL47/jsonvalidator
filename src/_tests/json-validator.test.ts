import { JsonValidator, Schema as V } from "..";
describe("JsonValidator", () => {
  const validator = new JsonValidator({
    schema: V.array(
      V.object({
        id: V.string().required(),
        name: V.string().required(),
        quantity: V.number().required(),
        tags: V.array(V.string()),
      }).required()
    ).min(2),
    throwError: true,
  });

  test("valid JSON test cases should pass", () => {
    const validTest1 = [
      { id: "1", name: "Product A", quantity: 10, tags: ["tag1", "tag2"] },
      { id: "2", name: "Product B", quantity: 5 },
    ];

    const validTest2 = [
      { id: "3", name: "Product C", quantity: 15, tags: [] },
      { id: "4", name: "Product D", quantity: 8, tags: ["tag3"] },
      { id: "5", name: "Product E", quantity: 20 },
    ];

    expect(() => validator.validate(validTest1)).not.toThrow();
    expect(() => validator.validate(validTest2)).not.toThrow();
  });

  test("invalid JSON test cases should throw errors", () => {
    const invalidTest1 = [
      { id: "6", name: "Product F", quantity: -5 },
      { id: "7", name: "Product G", quantity: 12, tags: "invalidTag" },
    ];

    const invalidTest2 = [
      { id: "8", name: "Product H", tags: ["tag4"] },
      { id: "9", name: "Product I", quantity: 10, extraField: "extra" },
    ];

    expect(() => validator.validate(invalidTest1)).toThrow();
    expect(() => validator.validate(invalidTest2)).toThrow();
  });
});

describe("JsonValidator", () => {
  const validator = new JsonValidator({
    schema: V.object({
      id: V.string().required(),
      name: V.string().required(),
      details: V.object({
        price: V.number().required(),
        ratings: V.array(
          V.object({
            rating: V.number().required(),
            comment: V.string(),
          }).required()
        ),
      }).required(),
      tags: V.array(V.string()),
    }).required(),
    throwError: true,
  });

  test("valid JSON test cases should pass", () => {
    const validTest1 = {
      id: "1",
      name: "Product A",
      details: {
        price: 20,
        ratings: [{ rating: 4, comment: "Good product" }, { rating: 5 }],
      },
      tags: ["tag1", "tag2"],
    };

    const validTest2 = {
      id: "2",
      name: "Product B",
      details: {
        price: 15,
        ratings: [{ rating: 5 }],
      },
    };

    expect(() => validator.validate(validTest1)).not.toThrow();
    expect(() => validator.validate(validTest2)).not.toThrow();
  });

  test("invalid JSON test cases should throw errors", () => {
    const invalidTest1 = {
      id: "3",
      details: {
        price: -5,
      },
    };

    const invalidTest2 = {
      name: "Product D",
      details: {
        price: 10,
        ratings: [{ rating: 6 }],
      },
    };

    expect(() => validator.validate(invalidTest1)).toThrow();
    expect(() => validator.validate(invalidTest2)).toThrow();
  });
});
