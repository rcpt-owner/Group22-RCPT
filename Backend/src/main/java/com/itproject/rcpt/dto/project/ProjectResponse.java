package com.itproject.rcpt.dto.project;

import java.time.Instant;
import java.util.List;
import com.itproject.rcpt.dto.nonstaffcost.NonStaffCostResponse;
import com.itproject.rcpt.dto.price.PriceSummaryResponse;
import com.itproject.rcpt.dto.staff.StaffCostResponse;
import com.itproject.rcpt.enums.ProjectStatus;

public class ProjectResponse {
  private String id;
  private ProjectDetailsDto details;
  private List<StaffCostResponse> staff;
  private List<NonStaffCostResponse> nonStaff;
  private PriceSummaryResponse priceSummary;
  private List<ApprovalEntryResponse> approvalsHistory;
  private ProjectStatus status;
  private String ownerUserId;
  private Instant createdAt;
  private Instant updatedAt;
  private Long version;

  public ProjectResponse() { }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }

  public ProjectDetailsDto getDetails() { return details; }
  public void setDetails(ProjectDetailsDto details) { this.details = details; }

  public List<StaffCostResponse> getStaff() { return staff; }
  public void setStaff(List<StaffCostResponse> staff) { this.staff = staff; }

  public List<NonStaffCostResponse> getNonStaff() { return nonStaff; }
  public void setNonStaff(List<NonStaffCostResponse> nonStaff) { this.nonStaff = nonStaff; }

  public PriceSummaryResponse getPriceSummary() { return priceSummary; }
  public void setPriceSummary(PriceSummaryResponse priceSummary) { this.priceSummary = priceSummary; }

  public List<ApprovalEntryResponse> getApprovalsHistory() { return approvalsHistory; }
  public void setApprovalsHistory(List<ApprovalEntryResponse> approvalsHistory) { this.approvalsHistory = approvalsHistory; }

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
