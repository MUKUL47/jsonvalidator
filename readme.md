# <a href="https://www.npmjs.com/package/anothersimplejsonvalidator" target="_blank">Deep Level JSON Validator</a>

A comprehensive tool for validating complex JSON structures

## Overview

This validator offers thorough validation of JSON data, ensuring it conforms to specified schemas. It supports nested structures, various data types, custom validation rules, and flexible error handling.

## Key Features

- **Deep Validation:** Validates nested objects and arrays, ensuring data integrity at every level.
- **Flexible Schema Definition:** Defines schemas using a type-safe, declarative API, covering diverse data types like strings, numbers, booleans, objects, arrays, and more.
- **Custom Validation Rules:** Enforces specific validation logic with regular expressions for strings and minimum/maximum length for arrays.
- **Error Handling:** Provides informative error messages with detailed context for easy debugging, including error types, locations, expected values, and schema details.
- **Exception Handling:** Optionally throws errors for immediate interruption of validation upon encountering invalid data.

## Usage

1. **Import the validator:**

   ```javascript
   import { JsonValidator, Schema } from "anothersimplejsonvalidator";
   ```

2. **Define the schema:**

   ```javascript
   const schema = Schema.object({
     id: Schema.string().required(),
     name: Schema.string().required(),
     details: Schema.object({
       price: Schema.number().required(),
       ratings: Schema.array(
         Schema.object({
           rating: Schema.number().required(),
           comment: Schema.string(),
         }).required()
       ),
     }).required(),
     tags: Schema.array(Schema.string()),
   }).required();
   ```

3. **Create a validator instance:**

   ```javascript
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
   ```

4. **Validate JSON data:**

   ```javascript
   const data = {
     // ... your JSON data
   };

   const validationResult = validator.validate(data);

   if (validationResult === true) {
     // Data is valid
   } else {
     // Handle errors
     console.error(validationResult); // Array of ErrorController objects
     /**
      [
        Y {
          key: [ 'string' ],
          location: 'JSON.a',
          type: 'expected',
          found: 'number',
          example: null,
          schemaType: null,
          message: 'Expected string but found number at JSON.a'
        }
      ]
      **/
   }
   ```

## Error Handling

The `validate` method returns either `true` if the data is valid, or an array of `ErrorController` objects containing detailed error information.

## Additional Information

- **Supported Data Types:** string, number, object, array, boolean, and any.
- **Error Types:** Unexpected, Expected, MissingKeys, MissingTypes, Exception, StringRegexMissmatch, NumberMinExpected, NumberMaxExpected.
- **Custom Validation Rules:** Regular expressions for strings, minimum/maximum length for arrays.

## License

MIT
