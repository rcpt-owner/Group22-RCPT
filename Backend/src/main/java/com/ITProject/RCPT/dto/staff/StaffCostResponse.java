package com.itproject.rcpt.dto.staff;

import java.util.List;
import com.itproject.rcpt.dto.common.YearAllocationDto;
import com.itproject.rcpt.enums.EmploymentType;
import com.itproject.rcpt.enums.StaffCategory;

public class StaffCostResponse {
  private String roleName;
  private EmploymentType employmentType;
  private StaffCategory category;
  private String timeBasis;
  private List<YearAllocationDto> time;
  private boolean inKind;
  private String notes;
  public StaffCostResponse() { }
  public String getRoleName() { return roleName; }
  public void setRoleName(String roleName) { this.roleName = roleName; }
  public EmploymentType getEmploymentType() { return employmentType; }
  public void setEmploymentType(EmploymentType employmentType) { this.employmentType = employmentType; }
  public StaffCategory getCategory() { return category; }
  public void setCategory(StaffCategory category) { this.category = category; }
  public String getTimeBasis() { return timeBasis; }
  public void setTimeBasis(String timeBasis) { this.timeBasis = timeBasis; }
  public List<YearAllocationDto> getTime() { return time; }
  public void setTime(List<YearAllocationDto> time) { this.time = time; }
  public boolean isInKind() { return inKind; }
  public void setInKind(boolean inKind) { this.inKind = inKind; }
  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }
}
