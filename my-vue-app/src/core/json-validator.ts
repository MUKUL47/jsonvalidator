import { DataType, TypeValue } from "../schema/type-core";
import { ErrorType, JSONObjectType, SchemaValidatorProps } from "./core-type";
import { ErrorController } from "./error-controller";
import { SchemaValidator } from "./schema-validator";

class JsonValidator {
  private schemaInstance: SchemaValidator;
  private unknownFields = new Set<String>();
  constructor({ schema }: SchemaValidatorProps) {
    this.schemaInstance = new SchemaValidator({ schema });
    this.initialize();
  }

  private initialize() {
    const schema = this.schemaInstance.schemaData;
    for (let k in schema) {
      if (
        schema[k].length === 1 &&
        !!(schema[k]?.[0] as TypeValue<DataType.OBJECT>).allowUnknown
      ) {
        this.unknownFields.add(k);
      }
    }
  }

  validate(node: Object | Array<any>) {
    this.validateNode(this.parseObject(node));
  }

  parseObject(node: Object | Array<any>) {
    const tree: JSONObjectType = {
      children: [],
      type: Array.isArray(node) ? DataType.ARRAY : typeof node,
    };
    let _tree = tree.children;
    function startParsing(
      node: any, // object or array
      target: Partial<JSONObjectType>[],
      parentNode: JSONObjectType
    ) {
      if (parentNode?.type === DataType.ARRAY) {
        parentNode.length = (node as Array<any>).length;
      }
      for (let key in node) {
        const type = typeof (node as any)[key];
        if (type !== DataType.OBJECT) {
          target.push({
            type,
            value: node[key],
            key,
          });
        } else if (type === DataType.OBJECT) {
          target.push({
            type: Array.isArray(node[key]) ? DataType.ARRAY : DataType.OBJECT,
            ...(Array.isArray(node) ? {} : { name: key }),
            children: [],
          });
          startParsing(
            node[key],
            target[target.length - 1].children ?? [],
            target[target.length - 1] as JSONObjectType
          );
        }
      }
    }
    startParsing(node, _tree, tree);

    return tree;
  }
  private validateNode(
    node: JSONObjectType,
    prefix = SchemaValidator.prefix,
    prefix_index = SchemaValidator.prefix
  ) {
    let children = node.children;
    if (
      prefix === SchemaValidator.prefix &&
      this.schemaInstance.schemaData[prefix][0].type != node.type
    ) {
      console.log(
        new ErrorController({
          type: ErrorType.Expected,
          found: node.type,
          location: prefix,
          key:
            this.schemaInstance.schemaData[prefix]?.map((v) => v?.type || "") ||
            [],
        })
      );
      // throw `Expected ${this.schemaInstance.schemaData[prefix]
      //   ?.map((v) => v.type)
      //   .join(" or ")
      //   .trim()} but found ${node.type} at ${prefix}`;
    }
    const recursiveChildren = [];
    const objectKeys: (String | DataType)[] = [];
    if (children.length === 0) {
    }
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const DEFAULT =
        node.type != DataType.ARRAY ? child?.key ?? child.name : "_";
      const DEFAULT_INDEX =
        child?.key != undefined ? child?.key : child.name || i;
      let key = `${prefix}.${DEFAULT}`;

      let key_index = `${prefix_index}.${DEFAULT_INDEX}`;
      if (
        this.unknownFields.has(prefix) &&
        !this.schemaInstance.schemaData[key]
      )
        continue;
      if (
        !this.schemaInstance.schemaData[key] &&
        !this.unknownFields.has(prefix)
      ) {
        // throw `Unexpected key ${key_index} at ${prefix}`;
        console.log(
          new ErrorController({
            type: ErrorType.Unexpected,
            location: prefix,
            key: [key_index],
          })
        );
      }
      const dataType = this.schemaInstance.schemaData[key]?.find(
        (schemaData) => schemaData.type == child.type
      );
      const currentSchemaTypes =
        this.schemaInstance.schemaData[key]?.map((v) => v?.type || "") || [];
      if (!dataType) {
        if (currentSchemaTypes[0] === DataType.ANY) continue;
        // throw `Expected ${currentSchemaTypes.join(" or ").trim()} but found ${
        //   child.type
        // } at ${key_index}`;
        console.log(
          new ErrorController({
            type: ErrorType.Expected,
            found: child.type,
            location: key_index,
            key: currentSchemaTypes,
          })
        );
        return;
      }
      const defaultKey = `${prefix}.${DEFAULT}`;
      const originalKey = `${prefix_index}.${DEFAULT_INDEX}`;
      if (
        [DataType.ARRAY, DataType.OBJECT].includes(dataType.type as DataType)
      ) {
        recursiveChildren.push([child, key, key_index]);
      }
      objectKeys.push(
        node.type === DataType.ARRAY
          ? child.type
          : ((child.name || child.key) as string)
      );
    }
    const isArray = node.type === DataType.ARRAY;
    if (isArray) {
      const arrayKey = `${prefix}._`;
      const filteredRequiredKeys = this.schemaInstance.schemaData[
        arrayKey
      ].filter((k) => k.required);
      const missingKeys = filteredRequiredKeys.filter(
        (obj) => !objectKeys.includes(obj.type!)
      );
      if (missingKeys.length) {
        console.log(
          new ErrorController({
            key: missingKeys.map((v) => v?.type || "{$}"),
            location: prefix,
            type: ErrorType.MissingTypes,
          })
        );
      }
    } else {
      const filteredRequiredKeys =
        this.schemaInstance.objectKeysMap
          .get(prefix)
          ?.filter((k) => k.required) || [];

      const missingKeys = filteredRequiredKeys.filter(
        (obj) => !objectKeys.includes((obj as any).name)
      );
      if (missingKeys.length) {
        console.log(
          new ErrorController({
            key: missingKeys.map((v) => (v as any).name),
            location: prefix_index,
            type: ErrorType.MissingKeys,
          })
        );
      }
    }
    recursiveChildren.forEach(([c, childPrefix, key_index]) =>
      this.validateNode(c as any, childPrefix as any, key_index as any)
    );
  }
}
export { JsonValidator };
