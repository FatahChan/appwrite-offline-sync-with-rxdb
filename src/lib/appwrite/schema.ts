import { ID, type Models } from "appwrite";
import { z } from "zod";
import { APPWRITE_COLLECTION_TODO, APPWRITE_DATABASE } from ".";

type Document<T = unknown> = Models.Document & T;

const appwriteDocumentSchema = z.object({
  $id: z.string().default(() => ID.unique()),
  $collectionId: z.string(),
  $databaseId: z.string().default(APPWRITE_DATABASE),
  $permissions: z.array(z.string()).default([]),
  $createdAt: z.string().default(() => new Date().toISOString()),
  $updatedAt: z.string().default(() => new Date().toISOString()),
});
export type AppwriteDocType = z.infer<typeof appwriteDocumentSchema>;

const todoDocumentSchema = appwriteDocumentSchema.extend({
  $collectionId: z.string().default(APPWRITE_COLLECTION_TODO),
  title: z.string(),
  completed: z.boolean(),
});

export type AppwriteTodoDocType = z.infer<typeof todoDocumentSchema>;

/**
 * This is a type guard function that checks if the given object matches the
 * `Document` type.
 */
export const _doesDocumentTypeMatch: z.infer<
  typeof appwriteDocumentSchema
> extends Document
  ? true
  : false = true;

export { appwriteDocumentSchema, todoDocumentSchema };
