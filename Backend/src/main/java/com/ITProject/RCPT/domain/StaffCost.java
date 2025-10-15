package com.itproject.rcpt.domain;

import java.util.List;

import com.uom.rcpt.domain.value.YearAllocation;
import com.uom.rcpt.enums.EmploymentType;
import com.uom.rcpt.enums.StaffCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class StaffCost {

  @NotBlank
  private String roleName;             // e.g., "RA Level A.6"

  @NotNull
  private EmploymentType employmentType;

  @NotNull
  private StaffCategory category;

  /** e.g., "FTE", "Hourly" */
  private String timeBasis;

  /** per-year FTE (or hours if using hourly) */
  private List<YearAllocation> time;

  private boolean inKind;

  private String notes;

  public StaffCost() { }

  public String getRoleName() { return roleName; }
  public void setRoleName(String roleName) { this.roleName = roleName; }

  public EmploymentType getEmploymentType() { return employmentType; }
  public void setEmploymentType(EmploymentType employmentType) { this.employmentType = employmentType; }

  public StaffCategory getCategory() { return category; }
  public void setCategory(StaffCategory category) { this.category = category; }

  public String getTimeBasis() { return timeBasis; }
  public void setTimeBasis(String timeBasis) { this.timeBasis = timeBasis; }

  public List<YearAllocation> getTime() { return time; }
  public void setTime(List<YearAllocation> time) { this.time = time; }

  public boolean isInKind() { return inKind; }
  public void setInKind(boolean inKind) { this.inKind = inKind; }

  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }
}
