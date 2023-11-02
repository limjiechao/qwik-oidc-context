// REF:
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types
export type ArrayItem<ArrayType> = ArrayType extends
  | readonly (infer ItemType)[]
  | (infer ItemType)[]
  ? ItemType
  : never;
