package com.itproject.rcpt.controllers.mongoLookupControllers;

import com.itproject.rcpt.domain.Project;
import com.itproject.rcpt.dto.project.ProjectCreateRequest;
import com.itproject.rcpt.dto.project.ProjectResponse;
import com.itproject.rcpt.dto.project.ProjectUpdateRequest;
import com.itproject.rcpt.enums.ProjectStatus;
import com.itproject.rcpt.mapper.ProjectMapper;
import com.itproject.rcpt.service.ProjectService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService service;
    private final ProjectMapper mapper;

    @Autowired
    public ProjectController(ProjectService service, ProjectMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    /**
     * Create a new project.
     * Note: ownerUserId is passed explicitly for now
     */
    @PostMapping
    public ResponseEntity<ProjectResponse> create(@RequestBody ProjectCreateRequest request,
                                                  @RequestParam String ownerUserId) {
        Project project = service.create(request, ownerUserId);
        return ResponseEntity.ok(mapper.toResponse(project));
    }

    /**
     * Get a project by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> get(@PathVariable String id) {
        Optional<Project> project = service.get(id);
        return project.map(value -> ResponseEntity.ok(mapper.toResponse(value)))
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * List projects with optional filtering.
     */
    @GetMapping
    public Page<ProjectResponse> list(@RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "10") int size,
                                      @RequestParam(required = false) String ownerUserId,
                                      @RequestParam(required = false) ProjectStatus status) {
        return service.list(page, size, ownerUserId, status)
                .map(mapper::toResponse);
    }

    /**
     * Update an existing project.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(@PathVariable String id,
                                                  @RequestBody ProjectUpdateRequest request) {
        Project updated = service.update(id, request);
        return ResponseEntity.ok(mapper.toResponse(updated));
    }

    /**
     * Delete a project by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
