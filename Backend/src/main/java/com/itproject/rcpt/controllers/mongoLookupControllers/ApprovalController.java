package com.itproject.rcpt.controllers.mongoLookupControllers;

import com.itproject.rcpt.domain.Project;
import com.itproject.rcpt.dto.project.ProjectResponse;
import com.itproject.rcpt.mapper.ProjectMapper;
import com.itproject.rcpt.service.ApprovalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * Approval actions for a project.
 * Base path: /api/v1/projects/{projectId}/approvals
 *
 * Accepts actorUserId via:
 *  - Header: X-User-Id  (highest priority)
 *  - Query : ?actorUserId=...
 *  - Body  : {"actorUserId":"...","comment":"..."}
 *
 * Accepts comment via:
 *  - Query : ?comment=...
 *  - Body  : {"comment":"..."}
 */

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

    /** Common DTO for actions */
    public static class ActionDto {
        public String actorUserId;
        public String comment;
        public ActionDto() {}
    }

    // ---------- Submit ----------
    @PostMapping("/submit")
    public ResponseEntity<ProjectResponse> submit(
            @PathVariable String projectId,
            @RequestHeader(name = "X-User-Id", required = false) String actorHeader,
            @RequestParam(name = "actorUserId", required = false) String actorParam,
            @RequestParam(name = "comment", required = false) String commentParam,
            @RequestBody(required = false) ActionDto body
    ) {
        String actor = resolveActor(actorHeader, actorParam, body != null ? body.actorUserId : null);
        if (isBlank(actor)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "actorUserId missing (send X-User-Id header, actorUserId query param, or in JSON body)");
        }
        String comment = resolveComment(commentParam, body != null ? body.comment : null);

        Project project = service.submit(projectId, actor, comment);
        return ResponseEntity.ok(mapper.toResponse(project));
    }

    // ---------- Approve ----------
    @PostMapping("/approve")
    public ResponseEntity<ProjectResponse> approve(
            @PathVariable String projectId,
            @RequestHeader(name = "X-User-Id", required = false) String actorHeader,
            @RequestParam(name = "actorUserId", required = false) String actorParam,
            @RequestParam(name = "comment", required = false) String commentParam,
            @RequestBody(required = false) ActionDto body
    ) {
        String actor = resolveActor(actorHeader, actorParam, body != null ? body.actorUserId : null);
        if (isBlank(actor)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "actorUserId missing (send X-User-Id header, actorUserId query param, or in JSON body)");
        }
        String comment = resolveComment(commentParam, body != null ? body.comment : null);

        Project project = service.approve(projectId, actor, comment);
        return ResponseEntity.ok(mapper.toResponse(project));
    }

    // ---------- Reject ----------
    @PostMapping("/reject")
    public ResponseEntity<ProjectResponse> reject(
            @PathVariable String projectId,
            @RequestHeader(name = "X-User-Id", required = false) String actorHeader,
            @RequestParam(name = "actorUserId", required = false) String actorParam,
            @RequestParam(name = "comment", required = false) String commentParam,
            @RequestBody(required = false) ActionDto body
    ) {
        String actor = resolveActor(actorHeader, actorParam, body != null ? body.actorUserId : null);
        if (isBlank(actor)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "actorUserId missing (send X-User-Id header, actorUserId query param, or in JSON body)");
        }
        String comment = resolveComment(commentParam, body != null ? body.comment : null);

        Project project = service.reject(projectId, actor, comment);
        return ResponseEntity.ok(mapper.toResponse(project));
    }

    // ---------- Comment ----------
    @PostMapping("/comment")
    public ResponseEntity<ProjectResponse> comment(
            @PathVariable String projectId,
            @RequestHeader(name = "X-User-Id", required = false) String actorHeader,
            @RequestParam(name = "actorUserId", required = false) String actorParam,
            @RequestParam(name = "comment", required = false) String commentParam,
            @RequestBody(required = false) ActionDto body
    ) {
        String actor = resolveActor(actorHeader, actorParam, body != null ? body.actorUserId : null);
        if (isBlank(actor)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "actorUserId missing (send X-User-Id header, actorUserId query param, or in JSON body)");
        }
        String comment = resolveComment(commentParam, body != null ? body.comment : null);

        Project project = service.comment(projectId, actor, comment);
        return ResponseEntity.ok(mapper.toResponse(project));
    }

    // ---------- helpers ----------
    private static String resolveActor(String header, String param, String bodyVal) {
        if (!isBlank(header)) return header.trim();
        if (!isBlank(param))  return param.trim();
        if (!isBlank(bodyVal)) return bodyVal.trim();
        return null;
    }

    private static String resolveComment(String param, String bodyVal) {
        if (!isBlank(param))  return param.trim();
        if (!isBlank(bodyVal)) return bodyVal.trim();
        return null;
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}