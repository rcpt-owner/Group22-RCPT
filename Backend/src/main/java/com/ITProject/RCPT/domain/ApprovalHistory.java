package com.itproject.rcpt.domain;

import java.util.ArrayList;
import java.util.List;

public class ApprovalTracker {

  /** Chronological log of actions on this project */
  private List<ApprovalEntry> history = new ArrayList<>();

  public ApprovalTracker() { }

  public List<ApprovalEntry> getHistory() { return history; }
  public void setHistory(List<ApprovalEntry> history) { this.history = history; }
}
