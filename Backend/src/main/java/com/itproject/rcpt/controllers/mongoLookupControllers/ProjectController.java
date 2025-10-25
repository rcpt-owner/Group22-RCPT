package com.itproject.rcpt.controllers.mongoLookupControllers;

import com.itproject.rcpt.domain.Project;
import com.itproject.rcpt.dto.project.ProjectCreateRequest;
import com.itproject.rcpt.dto.project.ProjectResponse;
import com.itproject.rcpt.dto.project.ProjectUpdateRequest;
import com.itproject.rcpt.enums.ProjectStatus;
import com.itproject.rcpt.mapper.ProjectMapper;
import com.itproject.rcpt.service.ProjectExportService;
import com.itproject.rcpt.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Optional;

/**
 * Project CRUD.
 * Base path: /api/v1/projects
 *
 * Create requires an owner user id via:
 *  - Header: X-User-Id
 *  - Query : ?ownerUserId=...
 */

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService service;
    private final ProjectMapper mapper;
    private final ProjectExportService projectExportService;

    @Autowired
    public ProjectController(ProjectService service, ProjectMapper mapper, ProjectExportService projectExportService) {
        this.service = service;
        this.mapper = mapper;
        this.projectExportService = projectExportService;
    }

    /**
     * Create a new project.
     * Returns 201 with Location header /api/v1/projects/{id}
     */
    @PostMapping
    public ResponseEntity<ProjectResponse> create(
            @RequestBody ProjectCreateRequest req,
            @RequestHeader(name = "X-User-Id", required = false) String ownerHeader,
            @RequestParam(name = "ownerUserId", required = false) String ownerParam
    ) {
        String ownerUserId = !isBlank(ownerHeader) ? ownerHeader.trim() :
                             (!isBlank(ownerParam) ? ownerParam.trim() : null);

        if (isBlank(ownerUserId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "ownerUserId missing (send X-User-Id header or ownerUserId query param)");
        }

        Project saved = service.create(req, ownerUserId);

        var location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.getId())
                .toUri();

        return ResponseEntity.created(location).body(mapper.toResponse(saved));
    }

    /**
     * Get a project by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> get(@PathVariable String id) {
        Optional<Project> project = service.get(id);
        return project
                .map(p -> ResponseEntity.ok(mapper.toResponse(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * List projects with optional filter by owner and status.
     * Example: /api/v1/projects?page=0&size=10&ownerUserId=dev-user-001&status=DRAFT
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
     * Update an existing project (full replace semantics).
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

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    @GetMapping("/{id}/export")
    public ResponseEntity<byte[]> exportProjectToPdf(@PathVariable String id) {
        byte[] pdfBytes = projectExportService.exportProjectToPdf(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "project_" + id + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

}