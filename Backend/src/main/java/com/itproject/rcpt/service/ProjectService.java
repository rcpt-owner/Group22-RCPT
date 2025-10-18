package com.itproject.rcpt.service;

import com.itproject.rcpt.domain.Project;
import com.itproject.rcpt.dto.project.ProjectCreateRequest;
import com.itproject.rcpt.dto.project.ProjectUpdateRequest;
import com.itproject.rcpt.enums.ProjectStatus;
import com.itproject.rcpt.mapper.ProjectMapper;
import com.itproject.rcpt.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * ProjectService handles all CRUD operations for Project documents stored in MongoDB.
 * It is the core business layer for creating, updating, retrieving, and listing projects.
 * Controllers should always talk to this service (not directly to the repository).
 */
@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper mapper;

    @Autowired
    public ProjectService(ProjectRepository projectRepository, ProjectMapper mapper) {
        this.projectRepository = projectRepository;
        this.mapper = mapper;
    }

    /**
     * Create a new project document and save it to MongoDB.
     * The ownerUserId is injected by the controller (authenticated user).
     */
    public Project create(ProjectCreateRequest request, String ownerUserId) {
        Project project = mapper.toEntity(request);
        project.setOwnerUserId(ownerUserId);
        return projectRepository.save(project);
    }

    /**
     * Retrieve a single project by ID.
     */
    public Optional<Project> get(String id) {
        return projectRepository.findById(id);
    }

    /**
     * Retrieve a paginated list of projects.
     * Supports filtering by owner (user-specific view) or by status.
     */
    public Page<Project> list(int page, int size, String ownerUserId, ProjectStatus status) {
        if (status != null) {
            return projectRepository.findByStatus(status, PageRequest.of(page, size));
        }
        if (ownerUserId != null) {
            return projectRepository.findByOwnerUserId(ownerUserId, PageRequest.of(page, size));
        }
        return projectRepository.findAll(PageRequest.of(page, size));
    }

    /**
     * Update an existing project with new data.
     * Only the fields provided in the update request are changed (partial update).
     */
    public Project update(String id, ProjectUpdateRequest request) {
        Project existing = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found: " + id));
        mapper.updateEntity(request, existing);
        return projectRepository.save(existing);
    }
}
