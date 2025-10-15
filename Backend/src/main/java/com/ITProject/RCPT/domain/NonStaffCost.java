package com.itproject.rcpt.domain;

import java.util.List;

import com.itproject.rcpt.domain.value.Money;
import com.itproject.rcpt.domain.value.YearAllocation;
import com.itproject.rcpt.enums.CostCategory;

import jakarta.validation.constraints.NotNull;

public class NonStaffCost {

  @NotNull
  private CostCategory category;

  private String description;

  /** Cost per item/unit in the line’s native currency */
  private Money unitCost;

  /** Total units across the project (if not using per-year breakdown) */
  private Double units;

  /** Per-year units, e.g., [{year:1, value:10}, {year:2, value:5}] */
  private List<YearAllocation> perYearUnits;

  private boolean inKind;

  private String notes;

  public NonStaffCost() { }

  public CostCategory getCategory() { return category; }
  public void setCategory(CostCategory category) { this.category = category; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public Money getUnitCost() { return unitCost; }
  public void setUnitCost(Money unitCost) { this.unitCost = unitCost; }

  public Double getUnits() { return units; }
  public void setUnits(Double units) { this.units = units; }

  public List<YearAllocation> getPerYearUnits() { return perYearUnits; }
  public void setPerYearUnits(List<YearAllocation> perYearUnits) { this.perYearUnits = perYearUnits; }

  public boolean isInKind() { return inKind; }
  public void setInKind(boolean inKind) { this.inKind = inKind; }

  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }
}
