const simpleJsonValidator = require("./index");
const ex1 = [];
const ex1S = { type : 'string' };
try{
    simpleJsonValidator(ex1, ex1S,{ throwError : true })
}catch(e){
    // console.log(e) //Incorrect type expected 'string' but found 'array'
}

const ex2 = {
    name : 'john',
    age : 10,
    house : {
        rooms : 5,
        color : 'orange',
        groundFloor : false
    },
    someArr : [1,2,3]
}
const ex2S = {
    type : 'object',
    property : {
        name :      { type : 'string' },
        age :       { type : 'number' },
        someArr :   { type : 'array' },
        house : { 
            type : 'object',
            property : {
                rooms :         { type : 'number' },
                color :         { type : 'string' },
                groundFloor :   { type : 'boolean' },
            }
         },
    }
}
// simpleJsonValidator(ex2, ex2S) //true

const ex3 = {
    a : { d : 1 },
    b : false,
    c : '_'
}
const ex3S = {
    type : 'object',
    property : {
        b : { type : 'boolean' },
        c : { type : 'string' },
        a : { 
            type : 'object',
            property : {
                d : 'string'
            } 
        },
    }
}

// console.log(simpleJsonValidator(ex3, ex3S,{ throwError : true })) //Invalid type for property jsonSchema.property.a.property.d


const ex4 = {
    b : false,
    c : '_'
}
const ex4S = {
    type : 'object',
    property : {
        b : { type : 'boolean' },
    }
}

// console.log(simpleJsonValidator(ex4, ex4S,{ throwError : true })) //Unexpected property 'c' found


const ex5 = {
    b : false,
    c : { }
}
const ex5S = {
    type : 'object',
    property : {
        b : { type : 'boolean' },
        c : { 
            type : 'object',
            property : {
                d : { type : "string" }
            }
        },
    }
}

console.log(simpleJsonValidator(ex5, ex5S,{ throwError : true })) //property 'd' missing in 'c'
