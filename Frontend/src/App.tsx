import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResearchCostingTool } from "./features/ResearchCostingTool";
import { NavigationMenuDemo } from "./components/demos/NavigationMenuDemo";

// pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import { ProjectFormPage } from "./pages/ProjectFormPage";
import { StaffCostsPage } from "./pages/StaffCostsPage";

function AppContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Menu */}
      <NavigationMenuDemo />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<ResearchCostingTool />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project" element={<ProjectWorkspace />} />
        <Route path="/project-form" element={<ProjectFormPage />} />
        <Route path="/staff-costs" element={<StaffCostsPage />} />
      </Routes>
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