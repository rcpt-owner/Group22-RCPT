import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, Settings, Plus } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getUserProjects, createUserProject, type Project } from "@/services/userService";

interface DashboardPageProps {
  onLogout: () => void;
  userId: string;
  onEnterWorkspace?: (projectId: string) => void;
}

export function DashboardPage({ onLogout, userId, onEnterWorkspace }: DashboardPageProps) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getUserProjects(userId);
        setProjects(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [userId]);

  const handleCreateProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: "Unnamed Project",
      ownerUserId: userId,
      currency: "AUD",
      status: "Draft",
      staffCosts: 0,
      nonStaffCosts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    createUserProject(userId, newProject);
    setProjects((prev) => [...prev, newProject]);
    onEnterWorkspace?.(newProject.id);
    navigate(`/projects/${newProject.id}`);
  };

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

          { /* FUTURE: will the settings be just for project-level configurations and lookup table for admin, or will there be some user data too to change? */ }
          <Button variant="ghost" size="icon" onClick={() => navigate("/adminSettings")}>
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
            onClick={handleCreateProject}
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Project
          </Button>
        </div>

        {loading ? (
          <p>Loading projects...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
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
