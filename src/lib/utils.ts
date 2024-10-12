import { AppwriteDocType } from "./appwrite/schema";
import { RxDbDocType } from "./RxDB/schema";

type OriginalKeys =
  | "id"
  | "collectionId"
  | "databaseId"
  | "permissions"
  | "createdAt"
  | "updatedAt";

type ConvertAppwriteDocToRxDbDoc<T extends AppwriteDocType> = {
  [K in keyof T as K extends `$${infer R}` ? R : K]: T[K];
};
function convertAppwriteDocToRxDbDoc<T extends AppwriteDocType>(doc: T) {
  const keysToMap = [
    "id",
    "collectionId",
    "databaseId",
    "permissions",
    "createdAt",
    "updatedAt",
  ] as const;
  const newDoc = Object.keys(doc).reduce((acc, key) => {
    if (keysToMap.some((k) => `$${k}` === key)) {
      return {
        ...acc,
        [key.slice(1)]: doc[key as keyof T],
      };
    }

    return {
      ...acc,
      [key]: doc[key as keyof T],
    };
  }, {} as ConvertAppwriteDocToRxDbDoc<T>);

  return newDoc;
}

type ConvertRxDbDocToAppwriteDoc<T extends RxDbDocType> = {
  [K in OriginalKeys as `$${K}`]: T[K];
} & Omit<T, OriginalKeys>; // Keep other properties unchanged

function convertRxDbDocToAppwriteDoc<T extends RxDbDocType>(doc: T) {
  const keysToMap = [
    "id",
    "collectionId",
    "databaseId",
    "permissions",
    "createdAt",
    "updatedAt",
  ] as const;
  const newDoc = Object.keys(doc).reduce((acc, key) => {
    if (keysToMap.some((k) => k === key)) {
      return {
        ...acc,
        [`$${key}`]: doc[key as keyof T],
      };
    }

    return {
      ...acc,
      [key]: doc[key as keyof T],
    };
  }, {} as ConvertRxDbDocToAppwriteDoc<T>);

  return newDoc;
}

export {
  convertAppwriteDocToRxDbDoc,
  convertRxDbDocToAppwriteDoc as convertRxDocToAppwriteDoc,
};
