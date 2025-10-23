import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { WorkspaceLayout } from "../features/Layouts/WorkspaceLayout";
import { AdminSettingsPage } from "../pages/AdminSettingsPage";

// Simple auth gate (local to routing layer)
function Protected({ authed, children }: { authed: boolean; children: React.ReactNode }) {
  return authed ? <>{children}</> : <Navigate to="/login" replace />;
}

export function AppRoutes(props: {
  authenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}) {
  const { authenticated, onLogin, onLogout } = props;

  return (
    <Routes>
      <Route
        path="/login"
        element={
          authenticated
            ? <Navigate to="/dashboard" replace />
            : <LoginPage onLogin={onLogin} />
        }
      />
      <Route
        path="/dashboard"
        element={
          <Protected authed={authenticated}>
            <DashboardPage
              onLogout={onLogout}
              userId="1"
            />
          </Protected>
        }
      />
      <Route
        path="/projects/:projectId"
        element={
          <Protected authed={authenticated}>
            <WorkspaceLayout />
          </Protected>
        }
      />
      <Route
        path="/adminSettings"
        element={
          <Protected authed={authenticated}>
            <AdminSettingsPage/>
          </Protected>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
