import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { UserProvider } from "./context/user/provider.tsx";
import { RxDBProvider } from "./context/RxDB/provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <RxDBProvider>
        <App />
      </RxDBProvider>
    </UserProvider>
  </StrictMode>
);
