import { DataType, Type, TypeData, TypeValue } from "../schema/type-core";
import { union } from "./util";

export class SchemaValidator {
  static readonly prefix = "JSON";
  private _schema: Type<DataType.OBJECT | DataType.ARRAY>;
  private schemaNodes: [String, Partial<Type<any>>][] = [];
  private _objectKeysMap: Map<
    String,
    { type: DataType | undefined; required: boolean; name?: string }[]
  > = new Map();
  private _union: Record<any, Partial<TypeValue<any>>[]>;
  constructor(schema: Type<DataType.OBJECT | DataType.ARRAY>) {
    this._schema = schema;
    if (![DataType.OBJECT, DataType.ARRAY].includes(this._schema.value.type)) {
      throw new Error("Can only validate Object(s) or Array(s)");
    }
    this._union = union(
      this.joinBranches(
        this._schema,
        SchemaValidator.prefix,
        this.schemaNodes,
        !!this._schema.value.nestedRequired
      )
    );
  }
  get schemaData(): Record<any, Partial<TypeValue<any>>[]> {
    return this._union;
  }

  get objectKeysMap() {
    return this._objectKeysMap;
  }
  private joinBranches(
    node: Type<DataType.OBJECT | DataType.ARRAY>,
    prefix = SchemaValidator.prefix,
    totalNodes: any = [],
    nestedRequired?: boolean
  ) {
    let children = node.value.children;
    children?.forEach((child: TypeData<any>) => {
      const DEFAULT = child.name || "_";
      let v = `${prefix}.${DEFAULT}`;
      const typeChild = child.value as TypeValue<
        DataType.ARRAY | DataType.OBJECT
      >;
      totalNodes.push([
        v,
        {
          ...child.value,
          children: typeChild?.children?.length,
          required: !!nestedRequired || !!child.value.required,
        },
      ]);
      if (child?.value?.type === DataType.OBJECT) {
        typeChild.children?.forEach(
          (c) => (c.value.required = !!nestedRequired || !!c.value.required)
        );
        this.updateObjectKeys(v, typeChild.children || []);
      }
      if ([DataType.OBJECT, DataType.ARRAY].includes(child.value.type)) {
        this.joinBranches(
          child as Type<DataType.ARRAY | DataType.OBJECT>,
          v,
          totalNodes,
          !!nestedRequired || !!typeChild.nestedRequired
        );
      }
    });
    totalNodes = [
      [
        SchemaValidator.prefix,
        {
          ...node.value,
          children: node.value?.children?.length,
        },
      ],
      ...totalNodes,
    ];
    if (node.value.type === DataType.OBJECT) {
      node.value.children?.forEach(
        (c) => (c.value.required = !!nestedRequired || !!c.value.required)
      );
      this.updateObjectKeys(
        SchemaValidator.prefix,
        (node?.value?.children ?? []) as Type<any>[]
      );
    }
    return totalNodes;
  }

  private updateObjectKeys(key: string, children: TypeData<any>[]) {
    this._objectKeysMap.set(
      key,
      children.map((v) => ({
        ...v,
        required: !!v?.value?.required,
        type: v.value?.type,
      }))
    );
  }
}
