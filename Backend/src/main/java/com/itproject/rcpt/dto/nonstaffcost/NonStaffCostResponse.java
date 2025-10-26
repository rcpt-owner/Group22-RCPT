package com.itproject.rcpt.dto.nonstaffcost;

import java.util.List;
import com.itproject.rcpt.dto.common.MoneyDto;
import com.itproject.rcpt.dto.common.YearAllocationDto;

public class NonStaffCostResponse {
  private String categoryCode;
  private String categoryLabel;
  private String expenseTypeCode;
  private String expenseTypeLabel;
  private String description;
  private MoneyDto unitCost;
  private Double units;
  private List<YearAllocationDto> perYearUnits;
  private boolean inKind;
  private String notes;
  public NonStaffCostResponse() { }
  public String getCategoryCode() { return categoryCode; }
  public void setCategoryCode(String categoryCode) { this.categoryCode = categoryCode; }
  public String getCategoryLabel() { return categoryLabel; }
  public void setCategoryLabel(String categoryLabel) { this.categoryLabel = categoryLabel; }
  public String getExpenseTypeCode() { return expenseTypeCode; }
  public void setExpenseTypeCode(String expenseTypeCode) { this.expenseTypeCode = expenseTypeCode; }
  public String getExpenseTypeLabel() { return expenseTypeLabel; }
  public void setExpenseTypeLabel(String expenseTypeLabel) { this.expenseTypeLabel = expenseTypeLabel; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public MoneyDto getUnitCost() { return unitCost; }
  public void setUnitCost(MoneyDto unitCost) { this.unitCost = unitCost; }
  public Double getUnits() { return units; }
  public void setUnits(Double units) { this.units = units; }
  public List<YearAllocationDto> getPerYearUnits() { return perYearUnits; }
  public void setPerYearUnits(List<YearAllocationDto> perYearUnits) { this.perYearUnits = perYearUnits; }
  public boolean isInKind() { return inKind; }
  public void setInKind(boolean inKind) { this.inKind = inKind; }
  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }
}
