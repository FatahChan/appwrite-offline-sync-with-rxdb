import { addRxPlugin, createRxDatabase, RxDatabase, WithDeleted } from "rxdb";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { replicateRxCollection } from "rxdb/plugins/replication";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { Collections, RxDbTodoDocType, schemas } from "./schema";

import { Query } from "appwrite";
import {
  APPWRITE_COLLECTION_TODO,
  APPWRITE_DATABASE,
  databases,
} from "../appwrite";
import { AppwriteTodoDocType } from "../appwrite/schema";
import { getAllAccessPermissions } from "../appwrite/utils";
import {
  convertAppwriteDocToRxDbDoc,
  convertRxDocToAppwriteDoc,
} from "../utils";

let db: RxDatabase<Collections>;
async function initDB() {
  if (db) {
    return db;
  }
  if (import.meta.env.MODE === "development") {
    await import("rxdb/plugins/dev-mode").then((module) =>
      addRxPlugin(module.RxDBDevModePlugin)
    );
  }
  addRxPlugin(RxDBQueryBuilderPlugin);
  addRxPlugin(RxDBUpdatePlugin);

  db = await createRxDatabase<Collections>({
    name: "todo-rxdb",
    storage: getRxStorageDexie(),
    multiInstance: true,
    eventReduce: true,
    ignoreDuplicate: true,
  });

  db.addCollections(schemas);

  return db;
}

export function initReplication() {
  const todoCollection = db.collections.todo;
  if (!todoCollection) {
    throw new Error("Todo collection not found");
  }

  replicateRxCollection({
    collection: db.todo,
    replicationIdentifier: "todo-replication",
    pull: {
      handler: async (checkpoint?: RxDbTodoDocType, batchSize = 100) => {
        const updatedAt = checkpoint
          ? checkpoint.updatedAt
          : new Date(0).toISOString();

        const response = await databases.listDocuments<AppwriteTodoDocType>(
          APPWRITE_DATABASE,
          APPWRITE_COLLECTION_TODO,
          [
            /* eslint-disable no-useless-escape */
            // prettier-ignore
            Query.greaterThanEqual("\$updatedAt", updatedAt),
            /* eslint-enable no-useless-escape */
            Query.limit(batchSize),
          ]
        );
        const documents: WithDeleted<RxDbTodoDocType>[] =
          response.documents.map((doc) => ({
            ...convertAppwriteDocToRxDbDoc(doc),
            _deleted: false,
          }));
        const newCheckpoint = documents.length
          ? documents[documents.length - 1]
          : null;
        return {
          documents: documents,
          checkpoint: newCheckpoint,
        };
      },
    },
    push: {
      handler: async (changedRows) => {
        const conflicts: WithDeleted<RxDbTodoDocType>[] = [];
        for (const changedRow of changedRows) {
          let realMasterState: AppwriteTodoDocType | null;
          try {
            realMasterState = await databases.getDocument<AppwriteTodoDocType>(
              APPWRITE_DATABASE,
              APPWRITE_COLLECTION_TODO,
              changedRow.newDocumentState.id
            );
          } catch {
            realMasterState = null;
          }
          const isDeleted = changedRow.newDocumentState._deleted;
          if (!realMasterState && isDeleted) {
            continue;
          }
          if (!realMasterState) {
            const appwriteAllAccessPermissions =
              await getAllAccessPermissions();
            const newDoc = convertRxDocToAppwriteDoc(
              changedRow.newDocumentState
            );

            await databases.createDocument<AppwriteTodoDocType>(
              APPWRITE_DATABASE,
              APPWRITE_COLLECTION_TODO,
              newDoc.$id,
              {
                ...convertRxDocToAppwriteDoc(changedRow.newDocumentState),
                $id: undefined,
                $collectionId: undefined,
                $databaseId: undefined,
                $permissions: undefined,
                $createdAt: undefined,
                $updatedAt: undefined,
                _deleted: undefined,
              },
              appwriteAllAccessPermissions
            );
            continue;
          }

          if (isDeleted) {
            await databases.deleteDocument(
              APPWRITE_DATABASE,
              APPWRITE_COLLECTION_TODO,
              changedRow.newDocumentState.id
            );
            continue;
          }
          const assumedMasterState = changedRow.assumedMasterState;

          const doesRealUpdateEqualAssumedUpdate =
            realMasterState.$updatedAt === assumedMasterState?.updatedAt;

          const isConflicting =
            (assumedMasterState && !doesRealUpdateEqualAssumedUpdate) ||
            !assumedMasterState;

          if (!isConflicting) {
            conflicts.push({
              ...changedRow.newDocumentState,
              _deleted:
                assumedMasterState._deleted ??
                changedRow.newDocumentState._deleted,
            });
            continue;
          }
          await databases.updateDocument<AppwriteTodoDocType>(
            APPWRITE_DATABASE,
            APPWRITE_COLLECTION_TODO,
            changedRow.newDocumentState.id,
            convertRxDocToAppwriteDoc(changedRow.newDocumentState)
          );
        }
        return conflicts;
      },
    },
  });
}

export default initDB;
