package com.itproject.rcpt;

import org.springframework.web.bind.annotation.*;

import com.uom.rcpt.dto.project.ProjectResponse;
import com.uom.rcpt.service.ApprovalService;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/approvals")
public class ApprovalController {

  private final ApprovalService service;
  public ApprovalController(ApprovalService service) { this.service = service; }

  public static class DecisionDto {
    public String actorUserId;
    public String comment;
    public DecisionDto() { }
  }

  @PostMapping("submit")
  public ProjectResponse submit(@PathVariable String projectId, @RequestBody DecisionDto body) {
    return service.submit(projectId, body.actorUserId, body.comment);
  }

  @PostMapping("approve")
  public ProjectResponse approve(@PathVariable String projectId, @RequestBody DecisionDto body) {
    return service.approve(projectId, body.actorUserId, body.comment);
  }

  @PostMapping("reject")
  public ProjectResponse reject(@PathVariable String projectId, @RequestBody DecisionDto body) {
    return service.reject(projectId, body.actorUserId, body.comment);
  }

  @PostMapping("comment")
  public ProjectResponse comment(@PathVariable String projectId, @RequestBody DecisionDto body) {
    return service.comment(projectId, body.actorUserId, body.comment);
  }
}
