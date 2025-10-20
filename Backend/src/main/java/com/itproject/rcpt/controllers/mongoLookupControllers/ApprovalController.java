package com.itproject.rcpt.controllers.mongoLookupControllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.itproject.rcpt.domain.Project;
import com.itproject.rcpt.dto.project.ProjectResponse;
import com.itproject.rcpt.mapper.ProjectMapper;
import com.itproject.rcpt.service.ApprovalService;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/approvals")
public class ApprovalController {

    private final ApprovalService service;
    private final ProjectMapper mapper;

    @Autowired
    public ApprovalController(ApprovalService service, ProjectMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    // DTO for approval actions
    public static class DecisionDto {
        public String actorUserId;
        public String comment;
        public DecisionDto() { }
    }

    // ---- Submit ----
    @PostMapping("/submit")
    public ResponseEntity<ProjectResponse> submit(
        @PathVariable String projectId,
        @RequestHeader(name = "X-User-Id", required = false) String actorHeader,
        @RequestParam(name = "actorUserId", required = false) String actorParam,
        @RequestParam(name = "comment", required = false) String comment) {

    String actor = resolveActor(actorHeader, actorParam, null);
    if (isBlank(actor)) {
        throw new IllegalArgumentException("actorUserId missing (send X-User-Id header or actorUserId query param)");
    }
    Project project = service.submit(projectId, actor, trimOrNull(comment));
    return ResponseEntity.ok(mapper.toResponse(project));
    }

    // ---- Approve ----
    @PostMapping("/approve")
    public ResponseEntity<ProjectResponse> approve(
        @PathVariable String projectId,
        @RequestHeader(name = "X-User-Id", required = false) String actorHeader,
        @RequestParam(name = "actorUserId", required = false) String actorParam,
        @RequestParam(name = "comment", required = false) String comment) {

    String actor = resolveActor(actorHeader, actorParam, null);
    if (isBlank(actor)) {
        throw new IllegalArgumentException("actorUserId missing (send X-User-Id header or actorUserId query param)");
    }
    Project project = service.approve(projectId, actor, trimOrNull(comment));
    return ResponseEntity.ok(mapper.toResponse(project));
    }

    // ---- Reject ----
    @PostMapping("/reject")
    public ResponseEntity<ProjectResponse> reject(
        @PathVariable String projectId,
        @RequestHeader(name = "X-User-Id", required = false) String actorHeader,
        @RequestParam(name = "actorUserId", required = false) String actorParam,
        @RequestParam(name = "comment", required = false) String comment) {

    String actor = resolveActor(actorHeader, actorParam, null);
    if (isBlank(actor)) {
        throw new IllegalArgumentException("actorUserId missing (send X-User-Id header or actorUserId query param)");
    }
    Project project = service.reject(projectId, actor, trimOrNull(comment));
    return ResponseEntity.ok(mapper.toResponse(project));
    }

    // ---- Comment ----
    @PostMapping("/comment")
    public ResponseEntity<ProjectResponse> comment(
        @PathVariable String projectId,
        @RequestHeader(name = "X-User-Id", required = false) String actorHeader,
        @RequestParam(name = "actorUserId", required = false) String actorParam,
        @RequestParam(name = "comment", required = false) String commentParam,
        @RequestBody(required = false) DecisionDto body) {

    String actor = resolveActor(actorHeader, actorParam, body != null ? body.actorUserId : null);
    if (isBlank(actor)) {
        throw new IllegalArgumentException("actorUserId missing (send X-User-Id header or actorUserId query param or include in body)");
    }
    String comment = !isBlank(commentParam) ? commentParam : (body != null ? trimOrNull(body.comment) : null);
    Project project = service.comment(projectId, actor, comment);
    return ResponseEntity.ok(mapper.toResponse(project));
    }
}
