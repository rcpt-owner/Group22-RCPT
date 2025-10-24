import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { ToastProvider } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);

  function handleLogin() {
    setAuthenticated(true);
  }
  function handleLogout() {
    setAuthenticated(false);
  }

  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="min-h-screen bg-background">
          <AppRoutes
            authenticated={authenticated}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
          <Toaster />
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}
