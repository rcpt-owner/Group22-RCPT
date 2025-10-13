import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";

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
      <div className="min-h-screen bg-background">
        <AppRoutes
          authenticated={authenticated}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      </div>
    </BrowserRouter>
  );
}