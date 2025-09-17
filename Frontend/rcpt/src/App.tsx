import { ResearchCostingTool } from "./components/ResearchCostingTool";

function AppContent() {

  return (
    <div className="min-h-screen bg-background">
      <ResearchCostingTool />
    </div>
  );
}

export default function App() {
  return (
      <AppContent />
  );
}