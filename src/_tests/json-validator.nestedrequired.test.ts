import { JsonValidator as J } from "../core/json-validator";
import { Schema as S } from "../schema";
describe("JSONValidator", () => {
  it("should throw error missing nested required fields", () => {
    const schema = S.array(
      S.string(),
      S.any(),
      S.object({ name: S.object({ surname: S.string() }).allowUnknown() })
    ).setNestedRequired();
    expect(() =>
      new J({ schema, throwError: true }).validate(["", { name: {} }])
    ).toThrow();
  });
});
