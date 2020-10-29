# <a href="https://www.npmjs.com/package/anothersimplejsonvalidator" target="_blank">A simple JSON validator.</a>

### installation

```
npm i anothersimplejsonvalidator
console.log(require('anothersimplejsonvalidator')(1, {type : 'number'}))
```

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
