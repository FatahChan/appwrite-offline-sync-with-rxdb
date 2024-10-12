import { RxCollection, RxJsonSchema } from "rxdb";
import { AppwriteDocType, AppwriteTodoDocType } from "../appwrite/schema";

export type MapperAppwriteToRxDb<T extends AppwriteDocType = AppwriteDocType> =
  {
    [K in keyof T as K extends `$${infer R}` ? R : K]: T[K];
  };

export type RxDbDocType = MapperAppwriteToRxDb<AppwriteDocType>;

export const documentJsonSchema: RxJsonSchema<RxDbDocType> = {
  title: "hero schema",
  version: 0,
  description: "describes a simple hero",
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    databaseId: {
      type: "string",
      maxLength: 100,
    },
    collectionId: {
      type: "string",
      maxLength: 100,
    },
    permissions: {
      type: "array",
      items: {
        type: "string",
      },
    },
    createdAt: {
      type: "string",
    },
    updatedAt: {
      type: "string",
    },
  },
  required: ["id", "permissions", "createdAt", "updatedAt"],
};

export type RxDbTodoDocType = MapperAppwriteToRxDb<AppwriteTodoDocType>;
export const todoJsonSchema: RxJsonSchema<RxDbTodoDocType> = {
  ...documentJsonSchema,
  properties: {
    ...documentJsonSchema.properties,
    title: {
      type: "string",
    },
    completed: {
      type: "boolean",
    },
  },
};

export const schemas = {
  todo: {
    schema: todoJsonSchema,
  },
};

export type Collections = {
  todo: RxCollection<RxDbTodoDocType>;
};
