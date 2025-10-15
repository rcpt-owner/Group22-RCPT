package com.ITProject.RCPT.JPA.Entities;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "stipend")
public class Stipend {

    @Id
    @Column(name = "\"year\"", nullable = false)
    private Integer year;

    @Column(nullable = false)
    private BigDecimal rate;

    // Getters and Setters
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