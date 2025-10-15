package com.itproject.rcpt.dto.project;

import java.util.List;
import com.uom.rcpt.dto.nonstaffcost.NonStaffCostRequest;
import com.uom.rcpt.dto.staff.StaffCostRequest;

public class ProjectCreateRequest {
  private ProjectDetailsDto details;
  private List<StaffCostRequest> staff;
  private List<NonStaffCostRequest> nonStaff;
  public ProjectCreateRequest() { }
  public ProjectDetailsDto getDetails() { return details; }
  public void setDetails(ProjectDetailsDto details) { this.details = details; }
  public List<StaffCostRequest> getStaff() { return staff; }
  public void setStaff(List<StaffCostRequest> staff) { this.staff = staff; }
  public List<NonStaffCostRequest> getNonStaff() { return nonStaff; }
  public void setNonStaff(List<NonStaffCostRequest> nonStaff) { this.nonStaff = nonStaff; }
}
