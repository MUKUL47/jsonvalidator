import { JsonValidator } from "./core/json-validator";
import { Schema as V } from "./schema";
let a = new JsonValidator({
  schema: V.array(
    V.object({
      key: V.string().required().example("some key"),
      value: V.number().required(),
      d: V.array(
        V.string(),
        V.object({ name: V.string().required() }).allowUnknown()
      ),
    }).required()
  )
    .required()
    .min(10),
});
console.log(
  a.validate([
    { key: "10", value: 20, d: ["2", { nsame: "123" }] },
    { key: "10", value: 20 },
    { key: "10", value: 20 },
    { key: "10", value: 20 },
    { key: "10", value: 20, d: ["asd"] },
    { key: "10", value: 20 },
    { key: "10", value: 20 },
    { key: "10", value: 20 },
    { key: "10", value: 20 },
    { key: "10", value: 20 },
    { key: "10", value: 20 },
  ])
);
