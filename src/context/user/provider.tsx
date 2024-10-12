import { ID, Models } from "appwrite";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { account } from "../../lib/appwrite";

interface UserContext {
  user: Models.User<Models.Preferences> | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (email: string, password: string) => void;
}

export const UserContext = createContext<UserContext | null>(null);

export function UserProvider(props: PropsWithChildren) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );

  async function login(email: string, password: string) {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      setUser(user);
      window.location.replace("/"); // you can use different redirect method for your application
    } catch (error) {
      console.error(error);
    }
  }

  async function logout() {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  }

  async function register(email: string, password: string) {
    try {
      await account.create(ID.unique(), email, password);
      await login(email, password);
    } catch (error) {
      console.error(error);
    }
  }

  async function init() {
    try {
      const user = await account.get();
      setUser(user);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, register }}>
      {props.children}
    </UserContext.Provider>
  );
}
