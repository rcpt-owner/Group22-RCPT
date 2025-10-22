package com.itproject.rcpt.domain;

import java.util.List;

import com.itproject.rcpt.domain.value.Money;
import com.itproject.rcpt.domain.value.YearAllocation;

/**
 * Domain model for a staff cost line item.
 * Embedded directly inside a Project document in MongoDB.
 */
public class StaffCost {

    /** Staff role  */
    private String role;

    /** Cost per unit (e.g., per FTE or per hour) */
    private Money unitCost;

    /** Total units */
    private Double units;

    /** Optional per-year breakdown */
    private List<YearAllocation> perYearUnits;

    /** Indicates if cost is in-kind */
    private boolean inKind;

    /** Additional notes */
    private String notes;

    public StaffCost() {}

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

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
