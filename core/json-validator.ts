import { Schema } from "../schema";
import { DataType, Type } from "../schema/type-core";
import { JsonValidatorProps } from "./core-type";
import { union } from "./util";

class JsonValidator {
  private _schema: Type<DataType.OBJECT | DataType.ARRAY>;
  private schemaNodes: [String, Partial<Type<any>>][] = [];
  private objectKeysMap: Map<String, { required: boolean; value: null }[]> =
    new Map();
  constructor(props: JsonValidatorProps) {
    this._schema = props.schema;
    if (![DataType.OBJECT, DataType.ARRAY].includes(this._schema.value.type)) {
      throw new Error("Can only validate Object(s) or Array(s)");
    }
    this.joinBranches(this._schema, "JSON", this.schemaNodes);
    console.log(union(this.schemaNodes));
  }
  joinBranches(node: any, prefix = "JSON", totalNodes: any = []) {
    let children = node.value?.children;
    children?.forEach((child, index) => {
      const DEFAULT = child?.name || child?.key || "_";
      let v = `${prefix}.${DEFAULT}`;
      this.schemaNodes.push([
        v,
        {
          ...child.value,
          children: child.value?.children?.length,
        },
      ]);
      if (child.value.type === DataType.OBJECT) {
        this.updateObjectKeys(v, child.value.children);
      }
      this.joinBranches(child, v, totalNodes);
    });
    this.schemaNodes = [
      [
        "JSON",
        {
          ...node.value,
          children: node.value?.children?.length,
        },
      ],
      ...this.schemaNodes,
    ];
    if (node.value.type === DataType.OBJECT) {
      this.updateObjectKeys("JSON", node.value.children);
    }
    return this.schemaNodes;
  }

  private updateObjectKeys(key: string, children: Partial<Type<any>>[]) {
    this.objectKeysMap.set(
      key,
      children.map((v) => ({
        ...v,
        required: !!v?.value?.required,
        value: null,
      }))
    );
  }
}

new JsonValidator({
  schema: Schema.array(Schema.boolean()),
});
