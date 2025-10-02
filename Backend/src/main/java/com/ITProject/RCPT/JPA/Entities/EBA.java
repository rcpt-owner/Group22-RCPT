package com.ITProject.RCPT.JPA.Entities;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "eba")
public class EBA {

    @Id
    @Column(nullable = false)
    private Integer year;

    @Column(name = "eba_increase")
    private BigDecimal ebaIncrease;

    @Column(name = "eba_multiplier", nullable = false)
    private BigDecimal ebaMultiplier;

    // --- Getters and Setters ---
    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public BigDecimal getEbaIncrease() {
        return ebaIncrease;
    }

    public void setEbaIncrease(BigDecimal ebaIncrease) {
        this.ebaIncrease = ebaIncrease;
    }

    public BigDecimal getEbaMultiplier() {
        return ebaMultiplier;
    }

    public void setEbaMultiplier(BigDecimal ebaMultiplier) {
        this.ebaMultiplier = ebaMultiplier;
    }
}