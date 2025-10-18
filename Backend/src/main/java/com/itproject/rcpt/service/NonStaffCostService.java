package com.itproject.rcpt.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itproject.rcpt.domain.NonStaffCost;
import com.itproject.rcpt.domain.Project;
import com.itproject.rcpt.repository.ProjectRepository;

/**
 * Service for managing Non-Staff costs inside a Project document.
 */
@Service
public class NonStaffCostService {

    @Autowired
    private ProjectRepository projectRepository;

    /**
     * Get all non-staff cost items for a given project.
     */
    public List<NonStaffCost> list(String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));
        return project.getNonStaffCosts();
    }

    /**
     * Replace all non-staff costs with a new list.
     */
    public List<NonStaffCost> replaceAll(String projectId, List<NonStaffCost> newCosts) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));

        project.setNonStaffCosts(newCosts);
        projectRepository.save(project);
        return project.getNonStaffCosts();
    }

    /**
     * Append a new non-staff cost to the list.
     */
    public List<NonStaffCost> append(String projectId, NonStaffCost cost) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));

        project.getNonStaffCosts().add(cost);
        projectRepository.save(project);
        return project.getNonStaffCosts();
    }

    /**
     * Delete a non-staff cost by index.
     */
    public List<NonStaffCost> deleteAt(String projectId, int index) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));

        if (index < 0 || index >= project.getNonStaffCosts().size()) {
            throw new IllegalArgumentException("Invalid index: " + index);
        }
        project.getNonStaffCosts().remove(index);
        projectRepository.save(project);
        return project.getNonStaffCosts();
    }
}
