package com.itproject.rcpt.service;

import com.itproject.rcpt.domain.ApprovalEntry;
import com.itproject.rcpt.domain.Project;
import com.itproject.rcpt.enums.ProjectStatus;
import com.itproject.rcpt.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

/**
 * ApprovalService handles transitions in project lifecycle states (Draft → Submitted → Approved)
 * and maintains a detailed audit trail (Approval History) with timestamps and comments.
 */
@Service
public class ApprovalService {

    private final ProjectRepository projectRepository;

    @Autowired
    public ApprovalService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    /**
     * Submit a project for review.
     * Moves status from DRAFT to SUBMITTED and records the action.
     */
    public Project submit(String projectId, String userId, String comment) {
        Project project = findProject(projectId);
        project.setStatus(ProjectStatus.SUBMITTED);
        addHistory(project, "SUBMIT", userId, comment);
        return projectRepository.save(project);
    }

    /**
     * Approve a project.
     * Moves status from SUBMITTED to APPROVED and records the action.
     */
    public Project approve(String projectId, String userId, String comment) {
        Project project = findProject(projectId);
        project.setStatus(ProjectStatus.APPROVED);
        addHistory(project, "APPROVE", userId, comment);
        return projectRepository.save(project);
    }

    /**
     * Reject a project.
     * Moves status back to DRAFT so the owner can re-edit and resubmit.
     */
    public Project reject(String projectId, String userId, String comment) {
        Project project = findProject(projectId);
        project.setStatus(ProjectStatus.DRAFT);
        addHistory(project, "REJECT", userId, comment);
        return projectRepository.save(project);
    }

    /**
     * Add a comment to the approval history without changing status.
     * Useful for reviewers leaving notes before final decision.
     */
    public Project comment(String projectId, String userId, String comment) {
        Project project = findProject(projectId);
        addHistory(project, "COMMENT", userId, comment);
        return projectRepository.save(project);
    }

    // Utility methods 

    /**
     * Fetch project or throw error if not found.
     */
    private Project findProject(String projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));
    }

    /**
     * Append an approval history entry to the project record.
     */
    private void addHistory(Project project, String action, String userId, String comment) {
        ApprovalEntry entry = new ApprovalEntry();
        entry.setAction(action);
        entry.setActorUserId(userId);
        entry.setComment(comment);
        entry.setAt(Instant.now());
        project.getApprovals().getHistory().add(entry);
    }
}
