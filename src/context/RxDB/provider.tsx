import { PropsWithChildren, useEffect, useState } from "react";
import initDB from "../../lib/RxDB";
import { RxDatabase } from "rxdb";
import { Collections } from "../../lib/RxDB/schema";
import { Provider } from "rxdb-hooks";

export function RxDBProvider(props: PropsWithChildren) {
  const [db, setDb] = useState<RxDatabase<Collections>>();

  useEffect(() => {
    initDB().then(setDb);
  }, []);

  return Provider<Collections>({ db, children: props.children });
}
