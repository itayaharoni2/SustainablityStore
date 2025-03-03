import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "@/lib/react-query/query-client.tsx";
import { Toaster } from "sonner";
import AuthProvider from "./context/auth-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <App />
          <Toaster richColors />
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>
);
