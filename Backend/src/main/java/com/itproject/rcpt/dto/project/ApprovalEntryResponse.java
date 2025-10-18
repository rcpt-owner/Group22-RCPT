package com.itproject.rcpt.dto.project;

import java.time.Instant;

public class ApprovalEntryResponse {
  private String action;
  private String actorUserId;
  private String comment;
  private Instant at;
  public ApprovalEntryResponse() { }
  public String getAction() { return action; }
  public void setAction(String action) { this.action = action; }
  public String getActorUserId() { return actorUserId; }
  public void setActorUserId(String actorUserId) { this.actorUserId = actorUserId; }
  public String getComment() { return comment; }
  public void setComment(String comment) { this.comment = comment; }
  public Instant getAt() { return at; }
  public void setAt(Instant at) { this.at = at; }
}
