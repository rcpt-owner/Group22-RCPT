package com.itproject.rcpt.service;

import com.itproject.rcpt.domain.Project;
import com.itproject.rcpt.enums.ProjectStatus;
import com.itproject.rcpt.repository.ProjectRepository;
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

        project.setStatus(ProjectStatus.valueOf("APPROVED"));
        return projectRepository.save(project);
    }

    /**
     * Reject a project and revert status back to DRAFT so it can be edited again
     */
    public Project revertToDraft(String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with ID: " + projectId));

        project.setStatus(ProjectStatus.valueOf("DRAFT"));
        return projectRepository.save(project);
    }
}
