package com.itproject.rcpt.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Tracks approval decisions and comments for a project.
 * Each entry captures the action (e.g. SUBMIT, APPROVE),
 * who performed it, an optional comment, and a timestamp.
 */
public class ApprovalTracker {

    private List<ApprovalEntry> history = new ArrayList<>();

    public List<ApprovalEntry> getHistory() {
        return history;
    }

    public void setHistory(List<ApprovalEntry> history) {
        this.history = history;
    }

    /** Add a new approval event to the history. */
    public void addEntry(String action, String actorUserId, String comment) {
        this.history.add(new ApprovalEntry(action, actorUserId, comment, Instant.now()));
    }
}
