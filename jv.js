/**
 * @param {{...}} jsonObject : actual json object
 * @param {{...}} jsonSchema : schema of the desired object
 * @param {{throwError : boolean}} options : if enabled throw where validation failed else return true or false.
 */
function simpleJsonValidator(jsonObject, jsonSchema, options){
    if(!jsonObject || !jsonSchema) {
        throw Error('JSONobject or JSONschema not found')
    }
    this.getNestedObject = () => {
        if(level.length === 0) return Object.assign({},this.jsonObject);
        return eval(`this.jsonObject.${level.join('.')}`)
    };
    this.getNestedType = (key) => {
        if(level.length === 0) return this.jsonObject[key];
        return eval(`this.jsonObject.${[...level, key].join('.')}`)
    };
    this.filterOriginalObj = (key) => {
        if(!key){
            if(this.level.length > 0){
                let jsC = Object.assign({},this.jsonObject);
                const exp = `delete jsC.${level.join('.')}${key ? `.${key}` : ''}`;
                eval(exp);
                this.jsonObject = jsC;
                level.pop()
            }else{
                return false;
            }
        }
        else if(typeof getNestedType(key) === 'object' && !Array.isArray(eval(getNestedProperty(key)))){
            this.level.push(key);
        }else {
            if(this.level.length === 0){
                delete this.jsonObject[key]
            }else{
                let jsC = Object.assign({},this.jsonObject);
                const exp = `delete jsC.${this.level.join('.')}${key ? `.${key}` : ''}`;
                eval(exp);
                if(!this.key && this.level.length > 0){
                    this.level.pop();
                }
                this.jsonObject = jsC;
            }
        }
        return true;
    }
    this.getNestedProperty = (key, schema) => {
        return `${schema ? schema : 'this.jsonObject'}${this.level.length > 0 ? `.${this.level.join('.')}` : ''}${key?`.${key}`:''}`
    }
    this.validateSchema = (keys) => {
        let top = Object.assign({}, jsonSchema);
        let error;
        if(!top.property) {
            return { error : true, message : `Property missing for schema` };
        }
        this.level.forEach(lvl => {
            top = top.property[lvl]
            if(!top.property) {
                error = { error : true, message : `Property missing for schema->${this.level.join('->')}` };
                return;
            }
        });
        if(error) return error;
        const schemaKeys = Object.keys(top.property)
        const objectKeys = keys;
        const levelMix = this.level.length > 0 ? ` in '${this.level.join('.')}'` : '';
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
    this.validateSchemaType = (nestedKey, originalType) => {
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
    this.getCustomType = (nestedVal) => {
        const val = eval(nestedVal)
        if(typeof val === 'object' && Array.isArray(val)){
            return 'array';
        }
        return typeof val;
    }
    this.enableError = options && options.throwError;
    this.jsonObject = jsonObject;
    jsonSchema = jsonSchema;
    this.visitedNodes = [];
    this.visitedNodesK = [];
    this.visitedNodesVal = [];
    this.key;
    this.iterating = true;
    this.level = [];
    this.jsC;
    while(this.iterating){
        this.jsC = this.getNestedObject();
        this.key = Object.keys(this.jsC)[0]
        const node = this.getNestedProperty(this.key, 'jsonSchema');
        const nestedVal = this.getNestedProperty(this.key);
        if(!this.visitedNodes.includes(node)){
            this.visitedNodes.push(node);
            this.visitedNodesVal.push({type : this.getCustomType(nestedVal), val : nestedVal})
        }
        if(!this.visitedNodesK.includes(this.level.join(''))){
            const valSchema = this.validateSchema(Object.keys(this.jsC));
            if(valSchema.error){
                if(this.enableError){
                    throw Error(valSchema.message);
                }
                return false;
            }
            this.visitedNodesK.push(this.level.join(''));
        }
        this.iterating = this.filterOriginalObj(key)
    };
    this.visitedNodes.pop();
    let errT = false;
    this.visitedNodes.forEach((v, i) => {
        const err = this.validateSchemaType(v, this.visitedNodesVal[i]);
        if(err.error){
            if(this.enableError){
                throw Error(err.error);
            }
            errT = true;
            return;
        }
    });
    if(errT) return false;
    return true;
}
const js = {
    name : 'john',
    name2 :'john',
};
const schema = {
    type : 'object',
    property : {
        name : { type : 'string' },
        name2 : {type : 'string'
        }
    }
}
const response = simpleJsonValidator(js,schema, { throwError : !true });
console.log(response)