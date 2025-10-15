package com.itproject.rcpt;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.itproject.rcpt.dto.project.ProjectCreateRequest;
import com.itproject.rcpt.dto.project.ProjectResponse;
import com.itproject.rcpt.dto.project.ProjectUpdateRequest;
import com.itproject.rcpt.enums.ProjectStatus;
import com.itproject.rcpt.service.ProjectService;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

  private final ProjectService service;
  public ProjectController(ProjectService service) { this.service = service; }

  @PostMapping
  public ResponseEntity<ProjectResponse> create(@RequestBody ProjectCreateRequest req,
                                                @RequestHeader("X-User-Id") String ownerUserId) {
    return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req, ownerUserId));
  }

  @GetMapping("{id}")
  public ProjectResponse get(@PathVariable String id) { return service.get(id); }

  @GetMapping
  public Page<ProjectResponse> list(@RequestParam(defaultValue="0") int page,
                                    @RequestParam(defaultValue="20") int size,
                                    @RequestParam(required=false) String ownerUserId,
                                    @RequestParam(required=false) ProjectStatus status) {
    return service.list(page, size, ownerUserId, status);
  }

  @PatchMapping("{id}")
  public ProjectResponse update(@PathVariable String id, @RequestBody ProjectUpdateRequest req) {
    return service.update(id, req);
  }
}
