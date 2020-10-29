let js = {
    name : 'john',
    namee : '2',
};
const schema = {
    type : 'object',
    property : {
        name : { type : 'string' },
        namee : { type : 'string' },
    }
}
/**
 * 1) allowError -> true = throw error | return false
 */

function checkIfArray(object){
    try{ return object.length > -1; }catch(e){ return false }
}
function getNestedObject(){
    if(level.length === 0) return Object.assign({},js);
    return eval(`js.${level.join('.')}`)
};
function getNestedType(key){
    if(level.length === 0) return js[key];
    return eval(`js.${[...level, key].join('.')}`)
};
function filterOriginalObj(key){
    if(!key){
        if(level.length > 0){
            let jsC = Object.assign({},js);
            const exp = `delete jsC.${level.join('.')}${key ? `.${key}` : ''}`;
            eval(exp);
            js = jsC;
            level.pop()
        }else{
            return false;
        }
    }
    else if(typeof getNestedType(key) === 'object' && !checkIfArray(eval(getNestedProperty(key)))){
        level.push(key);
    }else {
        if(level.length === 0){
            delete js[key]
        }else{
            let jsC = Object.assign({},js);
            const exp = `delete jsC.${level.join('.')}${key ? `.${key}` : ''}`;
            eval(exp);
            if(!key && level.length > 0){
                level.pop();
            }
            js = jsC;
        }
    }
    return true;
}
function getNestedProperty(key, schema){
    return `${schema ? schema : 'js'}${level.length > 0 ? `.${level.join('.')}` : ''}${key?`.${key}`:''}`
}
function validateSchema(keys){
    let top = Object.assign({}, schema);
    let error;
    const errMsg = level.length > 0 ? `->${level.join('.')}` : '';
    if(!top.property) {
        return { error : true, message : `Property missing for schema` };
    }
    level.forEach(lvl => {
        top = top.property[lvl]
        if(!top.property) {
            error = { error : true, message : `Property missing for schema->${level.join('->')}` };
            return;
        }
    });
    if(error) return error;
    const schemaKeys = Object.keys(top.property)
    const objectKeys = keys;
    const levelMix = level.length > 0 ? ` in '${level.join('.')}'` : '';
    if(schemaKeys.length < objectKeys.length){
        //unexpected property in main object
        let unknown = objectKeys.filter(key => !schemaKeys.includes(key))
        const props = unknown.length === 1 ? 'property' : 'properties';
        unknown = unknown.join(', ');
        return { error : true, message : `Unexpected ${props} (${unknown}) found${levelMix}` }
    }
    if(objectKeys.find(key => !schemaKeys.includes(key)) || schemaKeys.length !== objectKeys.length){
        //unknown property which is not mentioned in schema
        let missing = schemaKeys.filter(key => !objectKeys.includes(key));
        const props = missing.length === 1 ? 'property' : 'properties';
        missing = missing.join(', ');
        return { error : true, message : `${props} (${missing}) missing${levelMix}` }
    }
    return true;
};
function validateSchemaType(nestedKey, originalType){
    const schemaNested = `${nestedKey.split('.').join('.property.')}.type`;
    const checkVal = (nested) => {
        try{ return eval(nested) }catch(e){ false; }
    };
    const schemaType = checkVal(schemaNested);
    if(!schemaType){
        return { error : `Invalid type for : ${originalType.val}` }
    }
    if(originalType.type !== schemaType){
        return { error : `Incorrect type for ${originalType.val}, expected '${schemaType}' but found '${originalType.type}'` }
    }
    return true;
}
function getCustomType(nestedVal){
    const val = eval(nestedVal)
    if(typeof val === 'object' && checkIfArray(val)){
        return 'array';
    }
    return typeof val;
}
let level = [];
let jsC;
let key;
let iterating = true;
let visitedNodes = [];
let visitedNodesK = [];
let visitedNodesVal = [];
while(iterating){
    jsC = getNestedObject();
    key = Object.keys(jsC)[0]
    const node = getNestedProperty(key, 'schema');
    const nestedVal = getNestedProperty(key);
    if(!visitedNodes.includes(node)){
        visitedNodes.push(node);
        visitedNodesVal.push({type : getCustomType(nestedVal), val : nestedVal})
    }
    if(!visitedNodesK.includes(level.join(''))){
        const valSchema = validateSchema(Object.keys(jsC));
        if(valSchema.error){
            console.log(valSchema.message);
            return false;
        }
        visitedNodesK.push(level.join(''));
    }
    iterating = filterOriginalObj(key)
};
visitedNodes.pop();
visitedNodes.forEach((v, i) => {
    const err = validateSchemaType(v, visitedNodesVal[i]);
    if(err.error){
        console.log(err.error)
    }
})

/**
 * @param {{...}} jsonObject : actual json object
 * @param {{...}} jsonSchema : schema of the desired object
 * @param {{throwError : boolean}} options : if enabled throw where validation failed else return true or false.
 */
function simpleJsonValidator(jsonObject, jsonSchema, options){
    try{
        if(!jsonObject || !jsonSchema) {
            throw Error('JSONobject or JSONschema not found')
        }
        this.enableError = options.throwError;
        this.jsonObject = jsonObject;
        this.jsonSchema = jsonSchema;
    }catch(e){
        return false;
    }
}