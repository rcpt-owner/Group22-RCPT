package com.ITProject.RCPT.Entities;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "salary_rate_multiplier")
public class SalaryRateMultiplier {

    @Id
    @Column(name = "unit", nullable = false)
    private String unit;

    @Column(name = "multiplier", nullable = false, precision = 12, scale = 6)
    private BigDecimal multiplier;

    // Getters and Setters
    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getMultiplier() {
        return multiplier;
    }

    public void setMultiplier(BigDecimal multiplier) {
        this.multiplier = multiplier;
    }
}
