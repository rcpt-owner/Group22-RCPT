package com.itproject.rcpt.controllers.mongoLookupControllers;

import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping("submit")
    public ProjectResponse submit(@PathVariable String projectId, @RequestBody DecisionDto body) {
        Project project = service.submit(projectId, body.actorUserId, body.comment);
        return mapper.toResponse(project);
    }

    @PostMapping("approve")
    public ProjectResponse approve(@PathVariable String projectId, @RequestBody DecisionDto body) {
        Project project = service.approve(projectId, body.actorUserId, body.comment);
        return mapper.toResponse(project);
    }

    @PostMapping("reject")
    public ProjectResponse reject(@PathVariable String projectId, @RequestBody DecisionDto body) {
        Project project = service.reject(projectId, body.actorUserId, body.comment);
        return mapper.toResponse(project);
    }

    @PostMapping("comment")
    public ProjectResponse comment(@PathVariable String projectId, @RequestBody DecisionDto body) {
        Project project = service.comment(projectId, body.actorUserId, body.comment);
        return mapper.toResponse(project);
    }
}
