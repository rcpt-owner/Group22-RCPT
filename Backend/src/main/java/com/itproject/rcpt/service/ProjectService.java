package com.itproject.rcpt.service;

import com.yourapp.models.Project;
import com.yourapp.repositories.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    // Create a new project
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    // Get project by ID
    public Optional<Project> getProjectById(String id) {
        return projectRepository.findById(id);
    }

    // Get all projects
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // Update existing project
    public Project updateProject(String id, Project updatedProject) {
        Optional<Project> existing = projectRepository.findById(id);
        if (existing.isPresent()) {
            Project project = existing.get();
            project.setName(updatedProject.getName());
            project.setDescription(updatedProject.getDescription());
            project.setOwner(updatedProject.getOwner());
            project.setStatus(updatedProject.getStatus());
            return projectRepository.save(project);
        } else {
            throw new RuntimeException("Project not found with ID: " + id);
        }
    }

    // Delete project
    public void deleteProject(String id) {
        projectRepository.deleteById(id);
    }
}
