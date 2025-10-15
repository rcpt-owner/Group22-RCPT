import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, Bell, Settings, Plus } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getUserProjects, type Project } from "@/services/userService";

interface DashboardPageProps {
  onLogout: () => void;
  userId: string;
  onEnterWorkspace?: (projectId: string) => void;
}

export function DashboardPage({ onLogout, userId, onEnterWorkspace }: DashboardPageProps) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getUserProjects(userId);
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [userId]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 🔹 Top Navigation Bar */}
      <header className="w-full flex items-center justify-between px-10 py-5 border-b shadow-sm">
        <div className="flex items-center gap-4">
          {/* 🔸 Logo made larger */}
          <img
            src="/resources/University-of-Melbourne-logo-1.png"
            alt="Unimelb Logo"
            className="h-16 w-auto" // was h-10
          />
        </div>

        <h1 className="text-xl md:text-2xl font-semibold text-center tracking-wide uppercase">
          Research Costing and Pricing Tool
        </h1>

        <div className="flex items-center gap-4">
          {/* On home page (dashboard) the home button is primary */}
          <Button variant="default" size="icon"><Home className="h-5 w-5" /></Button>

          { /* Other buttons are ghost style and also functionality will come later. */}
          <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/adminSettings")}
            title="Admin Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button variant="outline" onClick={onLogout}>Logout</Button>
        </div>
      </header>

      {/* 🔹 Main content area with side padding */}
      <main className="flex-1 px-30 lg:px-30 py-10"> {/* increased padding */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Project Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              View and edit your projects.
            </p>
          </div>
          <Button
            className="bg-[#4B2E83] hover:bg-[#3a2364] text-white"
            onClick={() => navigate("/projects/new")}
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Project
          </Button>
        </div>

        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects yet — create a new one to get started.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"> {/* more spacing */}
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                ownerUserId={project.ownerUserId}
                status={project.status}
                createdAt={project.createdAt}
                updatedAt={project.updatedAt}
                onClick={() => {
                  onEnterWorkspace?.(project.id);
                  navigate(`/projects/${project.id}`);
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
