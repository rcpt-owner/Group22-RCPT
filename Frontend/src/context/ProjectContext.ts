import React, { createContext, useContext, useState, useEffect } from "react";

type ProjectData = {
  title: string;
  miniDescription: string;
  description: string;
  category: string;
  terms: boolean;
  budget?: number;
  deadline?: string;
  teamMembers: { name: string; role: string }[];
};

type ProjectContextType = {
  projectData: ProjectData;
  updateProjectData: (data: Partial<ProjectData>) => void;
};

const defaultProjectData: ProjectData = {
  title: "",
  miniDescription: "", 
  description: "",
  category: "",
  terms: false,
  budget: 0,
  deadline: "",
  teamMembers: [],
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectData, setProjectData] = useState<ProjectData>(defaultProjectData);

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        const response = await fetch("/projectFormDataDemo.json");
        if (!response.ok) {
          throw new Error("Failed to fetch project data");
        }
        const data: ProjectData = await response.json();
        setProjectData(data);
      } catch (error) {
        console.warn("Falling back to default project data:", error);
        setProjectData(defaultProjectData);
      }
    };

    loadProjectData();
  }, []);

  const updateProjectData = (data: Partial<ProjectData>) => {
    setProjectData((prev) => ({ ...prev, ...data }));
  };

  return React.createElement(
    ProjectContext.Provider,
    { value: { projectData, updateProjectData } },
    children
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};

// The goal of a context file is to be the single source of truth for your application's global state. Centralising all the related state (projectData, costData, costSummary) and the logic that manipulates it (calculateCosts) into one file.

// up for debate whether this is the best way to do it, or perhaps save json files or something into different contexts to send over later and find later.

