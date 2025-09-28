package com.ITProject.RCPT.Entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "salary_rate")
public class SalaryRate {

    public SalaryRate(){}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;   // Vlookup ID

    @Column(nullable = false)
    private String name;   // Classification label

    @Column(name = "payroll_type", nullable = false)
    private String payrollType; // Fortnight or Casual

    @Column(nullable = false)
    private String category; // Academic or Professional

    @Column(name = "fte_rate", precision = 12, scale = 2)
    private BigDecimal fteRate;

    @Column(name = "daily_rate", precision = 12, scale = 2)
    private BigDecimal dailyRate;

    @Column(name = "hourly_rate", precision = 12, scale = 2)
    private BigDecimal hourlyRate;

    private String currency;

    @Column(name = "effective_from")
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo;

    // Getters and Setters

    public LocalDate getEffectiveTo() { return effectiveTo;}

    public void setEffectiveTo(LocalDate effectiveTo) { this.effectiveTo = effectiveTo;}

    public LocalDate getEffectiveFrom() { return effectiveFrom;}

    public void setEffectiveFrom(LocalDate effectiveFrom) { this.effectiveFrom = effectiveFrom;}

    public String getCurrency() { return currency;}

    public void setCurrency(String currency) { this.currency = currency;}

    public BigDecimal getHourlyRate() { return hourlyRate;}

    public void setHourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate;}

    public BigDecimal getDailyRate() { return dailyRate;}

    public void setDailyRate(BigDecimal dailyRate) { this.dailyRate = dailyRate;}

    public BigDecimal getFteRate() { return fteRate;}

    public void setFteRate(BigDecimal fteRate) { this.fteRate = fteRate;}

    public String getCategory() { return category;}

    public void setCategory(String category) { this.category = category;}

    public String getPayrollType() { return payrollType;}

    public void setPayrollType(String payrollType) { this.payrollType = payrollType;}

    public String getName() { return name;}

    public void setName(String name) { this.name = name;}

    public String getCode() { return code;}

    public void setCode(String code) { this.code = code;}

    public Long getId() { return id;}

    public void setId(Long id) {this.id = id;}
}
