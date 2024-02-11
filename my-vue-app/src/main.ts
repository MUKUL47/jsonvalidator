import { JsonValidator } from "./core/json-validator";
import { SchemaValidator } from "./core/schema-validator";
import { Schema as V } from "./schema";
let a = new JsonValidator({
  schema: V.object({
    level1: V.object({
      prop1: V.string().required(),
      prop2: V.array().required(),
      b: V.any(),
      b2: V.any(),
      b3: V.any(),
      b4: V.any(),
    })
      .allowUnknown()
      .required(),
  }),
});
console.log(a.validate({}));
