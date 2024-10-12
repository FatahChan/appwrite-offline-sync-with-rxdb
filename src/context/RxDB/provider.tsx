import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren } from "react";
import { RxDatabase } from "rxdb";
import initDB from "../../lib/RxDB";
import { Collections } from "../../lib/RxDB/schema";

const RxDbContext = createContext<RxDatabase<Collections> | undefined>(
  undefined
);

function RxDbProvider({ children }: PropsWithChildren) {
  const { data: db } = useQuery({
    queryKey: ["db"],
    queryFn: async () => {
      return await initDB();
    },
  });
  return <RxDbContext.Provider value={db}>{children}</RxDbContext.Provider>;
}

export { RxDbContext, RxDbProvider };
