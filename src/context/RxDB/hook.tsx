import { useContext } from "react";
import { RxDbContext } from "./provider";

function useRxDb() {
  const context = useContext(RxDbContext);

  return context;
}

export default useRxDb;
