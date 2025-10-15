package com.itproject.rcpt.service;

import java.time.Instant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.itproject.rcpt.domain.ApprovalEntry;
import com.itproject.rcpt.domain.Project;
import com.itproject.rcpt.dto.project.ProjectCreateRequest;
import com.itproject.rcpt.dto.project.ProjectResponse;
import com.itproject.rcpt.dto.project.ProjectUpdateRequest;
import com.itproject.rcpt.enums.ProjectStatus;
import com.itproject.rcpt.mapper.ProjectMapper;
import com.itproject.rcpt.repository.ProjectRepository;

@Service
public class ProjectService {

  private final ProjectRepository repo;
  private final ProjectMapper mapper;

  public ProjectService(ProjectRepository repo, ProjectMapper mapper) {
    this.repo = repo; this.mapper = mapper;
  }

  public ProjectResponse create(ProjectCreateRequest req, String ownerUserId) {
    Project p = mapper.toEntity(req);
    p.setOwnerUserId(ownerUserId);
    // append history: CREATED
    var e = new ApprovalEntry();
    e.setAction("CREATED"); e.setActorUserId(ownerUserId); e.setAt(Instant.now());
    p.getApprovals().getHistory().add(e);
    // TODO: compute price summary if needed here
    return mapper.toResponse(repo.save(p));
  }

  public ProjectResponse get(String id) {
    Project p = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Project not found"));
    return mapper.toResponse(p);
  }

  public Page<ProjectResponse> list(int page, int size, String ownerUserId, ProjectStatus status) {
    PageRequest pr = PageRequest.of(page, size);
    Page<Project> pg;
    if (ownerUserId != null)      pg = repo.findByOwnerUserId(ownerUserId, pr);
    else if (status != null)      pg = repo.findByStatus(status, pr);
    else                          pg = repo.findAll(pr);
    return pg.map(mapper::toResponse);
  }

  public ProjectResponse update(String id, ProjectUpdateRequest req) {
    Project p = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Project not found"));
    mapper.updateEntity(req, p);
    // TODO: recompute price summary if costs changed
    return mapper.toResponse(repo.save(p));
  }
}
