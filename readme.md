# A simple JSON validator.

## Example

### object
```
object = {
    someNumber : 10,
    someBool : false,
    anotherObject : {
        someStr : 'John Doe,
        arr : []
    }
}
```
### installation
```
npm i anothersimplejsonvalidator
console.log(require('anothersimplejsonvalidator')(1, {type : 'number'}))
```

### schema syntax
```
schema = {
    type : 'object',
    property : {
        someNumber : { type : 'number' },
        someBool : { type : 'boolean' },
        anotherObject : {
            type : 'object',
            property : {
                someStr : { type : 'string' },
                arr : { type : 'array' }
            }
        }
    }
}
```

### options
```
simpleJsonValidator(object, schema, { throwError : true }) //will throw an error if validation failed
simpleJsonValidator(object, schema) //will simply return true or false
```
