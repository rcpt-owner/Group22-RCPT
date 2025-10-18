package com.itproject.rcpt.domain;

import java.time.Instant;

/** Log entry of an action taken on a project. */
public class ApprovalEntry {

  /** e.g., "SUBMITTED", "APPROVED", "REJECTED", "ARCHIVED" */
  private String action;

  /** User who performed the action */
  private String actorUserId;

  /** Optional free-text comment */
  private String comment;

  /** When it happened (server time) */
  private Instant at;

  public ApprovalEntry() { }

  public ApprovalEntry(String action, String actorUserId, String comment, Instant at) {
      this.action = action;
      this.actorUserId = actorUserId;
      this.comment = comment;
      this.at = at;
  }

  public String getAction() { return action; }
  public void setAction(String action) { this.action = action; }

  public String getActorUserId() { return actorUserId; }
  public void setActorUserId(String actorUserId) { this.actorUserId = actorUserId; }

  public String getComment() { return comment; }
  public void setComment(String comment) { this.comment = comment; }

  public Instant getAt() { return at; }
  public void setAt(Instant at) { this.at = at; }
}
