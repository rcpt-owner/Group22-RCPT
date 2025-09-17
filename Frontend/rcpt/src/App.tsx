import { ResearchCostingTool } from "./features/ResearchCostingTool";

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