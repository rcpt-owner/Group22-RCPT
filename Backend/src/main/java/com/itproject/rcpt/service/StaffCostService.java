package com.itproject.rcpt.service;

import com.itproject.rcpt.domain.Project;
import com.itproject.rcpt.domain.StaffCost;
import com.itproject.rcpt.dto.staff.StaffCostRequest;
import com.itproject.rcpt.mapper.ProjectMapper;
import com.itproject.rcpt.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * StaffCostService manages the "staffCosts" list embedded inside a Project document.
 * Similar to NonStaffCostService, it does not interact with a separate collection —
 * instead, it modifies the costs array directly inside the project document.
 */
@Service
public class StaffCostService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper mapper;

    @Autowired
    public StaffCostService(ProjectRepository projectRepository, ProjectMapper mapper) {
        this.projectRepository = projectRepository;
        this.mapper = mapper;
    }

    /**
     * Add or replace the staff costs associated with a project.
     */
    public Project addStaffCosts(String projectId, List<StaffCostRequest> costs) {
        Project project = findProject(projectId);
        List<StaffCost> domainCosts = mapper.toStaffCostList(costs);
        project.setStaffCosts(domainCosts);
        return projectRepository.save(project);
    }

    /**
     * Update behaves identically to add (replace all costs with new list).
     */
    public Project updateStaffCosts(String projectId, List<StaffCostRequest> costs) {
        return addStaffCosts(projectId, costs);
    }

    /**
     * Remove all staff costs from the project.
     */
    public Project deleteAllStaffCosts(String projectId) {
        Project project = findProject(projectId);
        project.getStaffCosts().clear();
        return projectRepository.save(project);
    }

    /**
     * Utility to fetch project or throw an error if not found.
     */
    private Project findProject(String projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));
    }
}
