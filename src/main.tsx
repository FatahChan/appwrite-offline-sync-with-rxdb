import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { UserProvider } from "./context/user/provider.tsx";
import TanStackQueryProvider from "./context/TanStackQuery/provider.tsx";
import { RxDbProvider } from "./context/RxDb/provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <TanStackQueryProvider>
        <RxDbProvider>
          <App />
        </RxDbProvider>
      </TanStackQueryProvider>
    </UserProvider>
  </StrictMode>
);
