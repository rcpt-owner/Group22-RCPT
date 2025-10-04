import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { ResearchCostingTool } from "./features/ResearchCostingTool";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";

type TopLevelView = "login" | "dashboard" | "workspace";

function AppContent() {
  const [view, setView] = useState<TopLevelView>("login");
  const [authenticated, setAuthenticated] = useState(false);

  function handleLogin() {
    setAuthenticated(true);
    setView("dashboard");
  }

  function handleLogout() {
    setAuthenticated(false);
    setView("login");
  }

  function openWorkspace() {
    setView("workspace");
  }

  if (!authenticated && view !== "login") {
    setView("login");
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Render pages based on authentication and view state */}
      {view === "login" && <LoginPage onLogin={handleLogin} />}
      {view === "dashboard" && authenticated && (
        <DashboardPage onEnterWorkspace={openWorkspace} onLogout={handleLogout} />
      )}
      {view === "workspace" && authenticated && (
        <ResearchCostingTool onExit={() => setView("dashboard")} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}