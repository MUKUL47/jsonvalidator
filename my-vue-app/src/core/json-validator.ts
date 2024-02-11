import { DataType, TypeValue } from "../schema/type-core";
import {
  ErrorControllerType,
  ErrorType,
  JSONObjectType,
  ValidatorProps,
} from "./core-type";
import { ErrorController } from "./error-controller";
import { SchemaValidator } from "./schema-validator";

class JsonValidator {
  private schemaInstance: SchemaValidator;
  private unknownFields = new Set<String>();
  private errors: ErrorController[] = [];
  private throwError = false;
  constructor({ schema, throwError }: ValidatorProps) {
    this.schemaInstance = new SchemaValidator(schema);
    this.throwError = !!throwError;
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

  validate(node: Object | Array<any>): true | ErrorController[] {
    this.validateNode(this.parseObject(node));
    if (!!this.errors.length) return true;
    return this.errors;
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
        this.collectErrors({
          type: ErrorType.Expected,
          found: node.type,
          location: prefix,
          key:
            this.schemaInstance.schemaData[prefix]?.map((v) => v?.type || "") ||
            [],
        })
      );
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
          this.collectErrors({
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
        if (currentSchemaTypes.includes(DataType.ANY)) continue;
        return this.collectErrors({
          type: ErrorType.Expected,
          found: child.type,
          location: key_index,
          key: currentSchemaTypes,
        });
      }
      // const defaultKey = `${prefix}.${DEFAULT}`;
      // const originalKey = `${prefix_index}.${DEFAULT_INDEX}`;
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
        this.collectErrors({
          key: missingKeys.map((v) => v?.type || "{$}"),
          location: prefix,
          type: ErrorType.MissingTypes,
        });
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
        this.collectErrors({
          key: missingKeys.map((v) => (v as any).name),
          location: prefix_index,
          type: ErrorType.MissingKeys,
        });
      }
    }
    recursiveChildren.forEach(([c, childPrefix, key_index]) =>
      this.validateNode(c as any, childPrefix as any, key_index as any)
    );
  }

  private collectErrors(props: ErrorControllerType) {
    if (this.throwError) throw new ErrorController(props);
    this.errors.push(new ErrorController(props));
  }
}
export { JsonValidator };
