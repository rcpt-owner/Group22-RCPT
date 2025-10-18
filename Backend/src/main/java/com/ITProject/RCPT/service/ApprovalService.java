package com.yourapp.services;

import com.yourapp.models.Project;
import com.yourapp.repositories.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ApprovalService {

    @Autowired
    private ProjectRepository projectRepository;

    /**
     * Approve a project by setting its status to APPROVED
     */
    public Project approveProject(String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with ID: " + projectId));

        project.setStatus("APPROVED");
        return projectRepository.save(project);
    }

    /**
     * Reject a project and revert status back to DRAFT so it can be edited again
     */
    public Project revertToDraft(String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with ID: " + projectId));

        project.setStatus("DRAFT");
        return projectRepository.save(project);
    }
}
