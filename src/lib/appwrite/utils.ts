import { Permission, Role } from "appwrite";
import { account } from ".";

export async function getAllAccessPermissions() {
  const user = await account.get();

  if (!user) {
    throw new Error("User not found");
  }
  return [
    Permission.read(Role.user(user.$id)),
    Permission.write(Role.user(user.$id)),
    Permission.delete(Role.user(user.$id)),
    Permission.update(Role.user(user.$id)),
  ];
}
