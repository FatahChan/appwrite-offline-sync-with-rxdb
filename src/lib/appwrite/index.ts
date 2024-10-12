import { Client, Account, Databases } from "appwrite";

const client = new Client();

const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const APPWRITE_DATABASE = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const APPWRITE_COLLECTION_TODO = import.meta.env
  .VITE_APPWRITE_COLLECTION_TODO_ID;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT) {
  throw new Error("Appwrite endpoint or project ID not found");
}
if (!APPWRITE_DATABASE || !APPWRITE_COLLECTION_TODO) {
  throw new Error("Appwrite database or collection ID not found");
}

client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT);

const account = new Account(client);
const databases = new Databases(client);
export {
  client,
  APPWRITE_DATABASE,
  APPWRITE_COLLECTION_TODO,
  account,
  databases,
};
