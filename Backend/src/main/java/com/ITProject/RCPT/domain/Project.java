package com.itproject.rcpt.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.uom.rcpt.enums.ProjectStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Aggregate root for RCPT projects.
 * Holds details, cost lines, computed price summary, and an approvals history log.
 * Lifecycle is tracked via ProjectStatus only (DRAFT, SUBMITTED, APPROVED, ARCHIVED).
 */
@Document("projects")
@CompoundIndex(name = "owner_status_idx", def = "{ 'ownerUserId': 1, 'status': 1 }")
public class Project {

  @Id
  private String id;

  /** Core metadata for the project (title, funder, dates, base currency, etc.). */
  @Valid
  @NotNull
  private ProjectDetails details;

  /** Staff cost lines (per-year allocations, in-kind flags, etc.). */
  @Valid
  private List<StaffCost> staffCosts = new ArrayList<>();

  /** Non-staff cost lines (equipment, travel, consumables, etc.). */
  @Valid
  private List<NonStaffCost> nonStaffCosts = new ArrayList<>();

  /** Snapshot of computed totals; updated by service logic. */
  private PriceSummary priceSummary;

  /** Chronological audit of projectstatus actions. */
  private ApprovalTracker approvals = new ApprovalTracker();

  /** Single lifecycle status of the project. */
  @Indexed
  private ProjectStatus status = ProjectStatus.DRAFT;

  /** Owner/creator of the project; used for filtering and access control. */
  @Indexed
  private String ownerUserId;

  /** Creation timestamp (set by Spring Data Mongo auditing). */
  @CreatedDate
  private Instant createdAt;

  /** Last modification timestamp (set by Spring Data Mongo auditing). */
  @LastModifiedDate
  private Instant updatedAt;

  /** Optimistic lock version. */
  @Version
  private Long version;

  public Project() { }

  // Getters / Setters  

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }

  public ProjectDetails getDetails() { return details; }
  public void setDetails(ProjectDetails details) { this.details = details; }

  public List<StaffCost> getStaffCosts() { return staffCosts; }
  public void setStaffCosts(List<StaffCost> staffCosts) {
    this.staffCosts = (staffCosts == null) ? new ArrayList<>() : staffCosts;
  }

  public List<NonStaffCost> getNonStaffCosts() { return nonStaffCosts; }
  public void setNonStaffCosts(List<NonStaffCost> nonStaffCosts) {
    this.nonStaffCosts = (nonStaffCosts == null) ? new ArrayList<>() : nonStaffCosts;
  }

  public PriceSummary getPriceSummary() { return priceSummary; }
  public void setPriceSummary(PriceSummary priceSummary) { this.priceSummary = priceSummary; }

  public ApprovalTracker getApprovals() { return approvals; }
  public void setApprovals(ApprovalTracker approvals) {
    this.approvals = (approvals == null) ? new ApprovalTracker() : approvals;
  }

  public ProjectStatus getStatus() { return status; }
  public void setStatus(ProjectStatus status) { this.status = status; }

  public String getOwnerUserId() { return ownerUserId; }
  public void setOwnerUserId(String ownerUserId) { this.ownerUserId = ownerUserId; }

  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

  public Long getVersion() { return version; }
  public void setVersion(Long version) { this.version = version; }
}
