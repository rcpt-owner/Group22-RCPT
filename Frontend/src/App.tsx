import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { ToastProvider } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // receive userId from LoginPage and keep it in memory
  function handleLogin(id?: string) {
    setAuthenticated(true);
    if (id) setUserId(id);
  }

  function handleLogout() {
    setAuthenticated(false);
    setUserId(null);
  }

  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="min-h-screen bg-background">
          <AppRoutes
            authenticated={authenticated}
            userId={userId ?? undefined}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
          <Toaster />
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}