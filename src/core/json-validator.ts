import { DataType, TypeValue } from "../schema/type-core";
import {
  CheckType,
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
      const type = schema[k].find((v) => v.type === DataType.OBJECT);
      if (!!type && (type as TypeValue<DataType.OBJECT>).allowUnknown) {
        this.unknownFields.add(k);
      }
    }
  }

  validate(node: Object | Array<any>): true | ErrorController[] {
    this.errors = [];
    this.validateNode(this.parseObject(node));
    if (this.errors.length === 0) return true;
    return this.errors;
  }

  private parseObject(node: Object | Array<any>) {
    //this step is not required recursive visit all node along side validation
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
      this.collectErrors({
        type: ErrorType.Expected,
        found: node.type,
        location: prefix,
        key:
          this.schemaInstance.schemaData[prefix]?.map((v) => v?.type || "") ||
          [],
        example: this.schemaInstance.schemaData[prefix][0].example,
      });
    }
    if (this.schemaInstance.schemaData[prefix][0].type === DataType.ARRAY) {
      this.checkArrayType({
        type: this.schemaInstance.schemaData[
          prefix
        ][0] as TypeValue<DataType.ARRAY>,
        child: node,
        key_index: prefix,
        prefix,
      });
    }
    const recursiveChildren = [];
    const objectKeys: (String | DataType)[] = [];
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
        return this.collectErrors({
          type: ErrorType.Unexpected,
          location: prefix,
          key: [key_index],
        });
      }
      const schemaDataType = this.schemaInstance.schemaData[key]?.find(
        (schemaData) => schemaData.type == child.type
      );
      const currentSchemaTypes =
        this.schemaInstance.schemaData[key]?.map((v) => v?.type || "") || [];
      if (!schemaDataType) {
        if (currentSchemaTypes.includes(DataType.ANY)) continue;
        return this.collectErrors({
          type: ErrorType.Expected,
          found: child.type,
          location: key_index,
          key: currentSchemaTypes,
        });
      }
      if (schemaDataType.type === DataType.STRING) {
        this.checkStringType({
          type: schemaDataType as TypeValue<DataType.STRING>,
          child,
          key_index,
          prefix,
        });
      }
      if (
        [DataType.ARRAY, DataType.OBJECT].includes(
          schemaDataType.type as DataType
        )
      ) {
        if (schemaDataType.type === DataType.ARRAY) {
          this.checkArrayType({
            type: schemaDataType as TypeValue<DataType.ARRAY>,
            child,
            key_index,
            prefix,
          });
        }
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
      const missingKeys = this.schemaInstance.schemaData[arrayKey].filter(
        (obj) =>
          !objectKeys.includes(obj.type) &&
          !!obj.required &&
          ![DataType.ANY].includes(obj.type)
      );
      if (missingKeys.length > 0) {
        this.collectErrors({
          key: missingKeys.map((v) => v?.type || "{$}"),
          location: prefix,
          type: ErrorType.MissingTypes,
        });
      }
    } else {
      const missingKeys =
        this.schemaInstance.objectKeysMap
          .get(prefix)
          ?.filter(
            (obj) =>
              !objectKeys.includes((obj as any)?.name) &&
              !!obj.required &&
              ![DataType.ANY].includes(obj.type)
          ) ?? [];
      if (missingKeys.length > 0) {
        this.collectErrors({
          key: missingKeys.map((v) => (v as any).name),
          location: prefix_index,
          type: ErrorType.MissingKeys,
        });
      }
    }
    recursiveChildren.forEach(([c, childPrefix, key_index]) =>
      this.validateNode(
        c as JSONObjectType,
        childPrefix as string,
        key_index as string
      )
    );
  }

  private checkArrayType({
    type,
    child,
    key_index,
    prefix,
  }: CheckType<DataType.ARRAY>) {
    const errors: ErrorType[] = [];
    const errorParams = {
      key: [key_index],
      location: prefix,
      example: type.example,
    };
    if (!!type.max && !isNaN(+type.max) && child.children.length > +type.max) {
      errors.push(ErrorType.NumberMaxExpected);
    } else if (
      !!type.min &&
      !isNaN(+type.min) &&
      child.children.length < +type.min
    ) {
      errors.push(ErrorType.NumberMinExpected);
    }
    errors.forEach((e) =>
      this.collectErrors({ ...errorParams, type: e }, type)
    );
  }

  private checkStringType({
    type,
    child,
    key_index,
    prefix,
  }: CheckType<DataType.STRING>) {
    if (
      !!type.shouldMatch &&
      !!!type.shouldMatch.some((r) => r.test(child.value.toString()))
    ) {
      this.collectErrors({
        key: [key_index],
        location: prefix,
        type: ErrorType.StringRegexMissmatch,
        example: type.example,
      });
    }
  }

  private collectErrors(
    props: ErrorControllerType,
    type?: TypeValue<DataType>
  ) {
    if (this.throwError) throw new ErrorController(props, type);
    this.errors.push(new ErrorController(props, type));
  }
}
export { JsonValidator };
