package com.itproject.rcpt.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itproject.rcpt.domain.Project;
import com.itproject.rcpt.domain.StaffCost;
import com.itproject.rcpt.repository.ProjectRepository;

/**
 * Service for managing Staff costs within a project.
 */
@Service
public class StaffCostService {

    @Autowired
    private ProjectRepository projectRepository;

    // Get all staff costs for a specific project
    public List<StaffCost> list(String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));
        return project.getStaffCosts();
    }

    // Replace the entire staff cost list with a new one
    public List<StaffCost> replaceAll(String projectId, List<StaffCost> newCosts) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));
        project.setStaffCosts(newCosts);
        projectRepository.save(project);
        return project.getStaffCosts();
    }

    // Append a new staff cost entry
    public List<StaffCost> append(String projectId, StaffCost cost) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));
        project.getStaffCosts().add(cost);
        projectRepository.save(project);
        return project.getStaffCosts();
    }

    // Delete a staff cost entry by index
    public List<StaffCost> deleteAt(String projectId, int index) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));
        if (index < 0 || index >= project.getStaffCosts().size()) {
            throw new IllegalArgumentException("Invalid index: " + index);
        }
        project.getStaffCosts().remove(index);
        projectRepository.save(project);
        return project.getStaffCosts();
    }
}
