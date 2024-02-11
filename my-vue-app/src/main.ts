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
console.log(a.validate({ level1: { v: { s: [2, { s: 2 }] }, d: 2 } }));
