package com.itproject.rcpt.dto.nonstaffcost;

import java.util.List;
import com.itproject.rcpt.dto.common.MoneyDto;
import com.itproject.rcpt.dto.common.YearAllocationDto;

public class NonStaffCostRequest {
  private String categoryCode;     // e.g., "CONS"
  private String expenseTypeCode;  // e.g., "CONS_LIBRARY"
  private String description;
  private MoneyDto unitCost;
  private Double units;
  private List<YearAllocationDto> perYearUnits;
  private Boolean inKind;
  private String notes;
  public NonStaffCostRequest() { }
  public String getCategoryCode() { return categoryCode; }
  public void setCategoryCode(String categoryCode) { this.categoryCode = categoryCode; }
  public String getExpenseTypeCode() { return expenseTypeCode; }
  public void setExpenseTypeCode(String expenseTypeCode) { this.expenseTypeCode = expenseTypeCode; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public MoneyDto getUnitCost() { return unitCost; }
  public void setUnitCost(MoneyDto unitCost) { this.unitCost = unitCost; }
  public Double getUnits() { return units; }
  public void setUnits(Double units) { this.units = units; }
  public List<YearAllocationDto> getPerYearUnits() { return perYearUnits; }
  public void setPerYearUnits(List<YearAllocationDto> perYearUnits) { this.perYearUnits = perYearUnits; }
  public Boolean getInKind() { return inKind; }
  public void setInKind(Boolean inKind) { this.inKind = inKind; }
  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }
}
