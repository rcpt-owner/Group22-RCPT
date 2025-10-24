package com.itproject.rcpt.jpa.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "payroll_tax")
public class PayrollTax {

    @Id
    @Column(name = "\"year\"", nullable = false)
    private Integer year;

    @Column(precision = 5, scale = 4)
    private BigDecimal rate;

    // --- Getters and Setters ---
    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public BigDecimal getRate() {
        return rate;
    }

    public void setRate(BigDecimal rate) {
        this.rate = rate;
    }
}