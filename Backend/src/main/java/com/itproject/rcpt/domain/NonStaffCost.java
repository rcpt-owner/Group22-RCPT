package com.itproject.rcpt.domain;

import java.util.List;

import com.itproject.rcpt.domain.value.Money;
import com.itproject.rcpt.domain.value.YearAllocation;

import jakarta.validation.constraints.NotNull;

/**
 * Domain model representing a single non-staff cost item in a project.
 */
public class NonStaffCost {

    /** Lookup code for the cost category */
    @NotNull
    private String categoryCode;

    /** Lookup code for the expense type */
    private String expenseTypeCode;

    /** Free-text description of the cost */
    private String description;

    /** Cost per unit (in native currency) */
    private Money unitCost;

    /** Total number of units (if not using per-year breakdown) */
    private Double units;

    /** Per-year unit breakdown (optional) */
    private List<YearAllocation> perYearUnits;

    /** Whether the cost is provided in-kind (true) or paid (false) */
    private boolean inKind;

    /** Additional notes */
    private String notes;

    public NonStaffCost() {}

    public String getCategoryCode() { return categoryCode; }
    public void setCategoryCode(String categoryCode) { this.categoryCode = categoryCode; }

    public String getExpenseTypeCode() { return expenseTypeCode; }
    public void setExpenseTypeCode(String expenseTypeCode) { this.expenseTypeCode = expenseTypeCode; }

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
