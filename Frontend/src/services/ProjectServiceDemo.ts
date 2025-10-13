export type ProjectData = {
  title: string;
  miniDescription: string;
  description: string;
  category: string;
  terms: boolean;
  budget?: number;
  deadline?: string;
  teamMembers: { name: string; role: string }[];
};

// Mock API base URL - replace with real API later
const API_BASE_URL = "/api";

export const ProjectService = {
  getProjectData: async (): Promise<ProjectData> => {
    try {
      // For now, fetch from static JSON. Later, replace with: `${API_BASE_URL}/project`
      const response = await fetch("/projectFormDataDemo.json");
      if (!response.ok) {
        throw new Error("Failed to fetch project data");
      }
      const data: ProjectData = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching project data:", error);
      throw error;
    }
  },

  saveProjectData: async (data: ProjectData): Promise<void> => {
    try {
      // Mock API call - replace with real endpoint later
      // const response = await fetch(`${API_BASE_URL}/project`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      
      console.log("Saving project data:", data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Project data saved successfully.");
    } catch (error) {
      console.error("Error saving project data:", error);
      throw error;
    }
  },

  updateProjectData: async (partialData: Partial<ProjectData>): Promise<void> => {
    try {
      // Mock API call - replace with real endpoint later
      // const response = await fetch(`${API_BASE_URL}/project`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(partialData),
      // });
      
      console.log("Updating project data with:", partialData);
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Project data updated successfully.");
    } catch (error) {
      console.error("Error updating project data:", error);
      throw error;
    }
  },

  // New method for creating a project
  createProject: async (data: ProjectData): Promise<ProjectData> => {
    try {
      console.log("Creating new project:", data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },
};