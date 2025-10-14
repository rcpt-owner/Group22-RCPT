import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Home, Bell, Settings, Plus } from "lucide-react";

interface Project {
  id: string;
  name: string;
  status: string;
  date: string;
}

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
        const res = await fetch("/api/getUserProjects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: userId }),
        });
        const data: Project[] = await res.json();
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
          <Button variant="ghost" size="icon"><Home className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon"><Settings className="h-5 w-5" /></Button>
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
              <Card
                key={project.id}
                className="transition hover:shadow-lg cursor-pointer"
                onClick={() => {
                  onEnterWorkspace?.(project.id);
                  navigate(`/projects/${project.id}`);
                }}
              >
                <CardHeader>
                  <div className="bg-gray-200 h-24 w-full rounded-md mb-3" />
                  <CardTitle className="text-base font-semibold">
                    {project.name}
                  </CardTitle>
                  <CardContent className="p-0 mt-2 text-sm text-muted-foreground space-y-1">
                    <p>Status: {project.status}</p>
                    <p>Date: {project.date}</p>
                  </CardContent>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
