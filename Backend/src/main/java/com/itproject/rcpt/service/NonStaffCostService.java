package com.itproject.rcpt.service;

import com.itproject.rcpt.domain.NonStaffCost;
import com.itproject.rcpt.domain.Project;
import com.itproject.rcpt.dto.nonstaffcost.NonStaffCostRequest;
import com.itproject.rcpt.mapper.ProjectMapper;
import com.itproject.rcpt.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * NonStaffCostService manages the "nonStaffCosts" embedded list inside a Project document.
 * It converts DTOs into domain objects and updates the Project in MongoDB.
 * No standalone Mongo collection is used for costs — they are nested inside each project.
 */
@Service
public class NonStaffCostService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper mapper;

    @Autowired
    public NonStaffCostService(ProjectRepository projectRepository, ProjectMapper mapper) {
        this.projectRepository = projectRepository;
        this.mapper = mapper;
    }

    /**
     * Add or replace the full list of non-staff costs for a project.
     */
    public Project addNonStaffCosts(String projectId, List<NonStaffCostRequest> costs) {
        Project project = findProject(projectId);
        List<NonStaffCost> domainCosts = mapper.toNonStaffList(costs);
        project.setNonStaffCosts(domainCosts);
        return projectRepository.save(project);
    }

    /**
     * Alias for add — both create and update are handled by replacing the full list.
     */
    public Project updateNonStaffCosts(String projectId, List<NonStaffCostRequest> costs) {
        return addNonStaffCosts(projectId, costs);
    }

    /**
     * Remove all non-staff costs from a project.
     */
    public Project deleteAllNonStaffCosts(String projectId) {
        Project project = findProject(projectId);
        project.getNonStaffCosts().clear();
        return projectRepository.save(project);
    }

    /**
     * Helper method to fetch a project or throw an exception.
     */
    private Project findProject(String projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));
    }
}
