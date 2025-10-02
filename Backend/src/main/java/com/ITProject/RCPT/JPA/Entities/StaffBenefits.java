package com.ITProject.RCPT.JPA.Entities;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "staff_benefits")
public class StaffBenefits {

    @Id
    @Column(name = "staff_type", length = 45, nullable = false)
    private String staffType;

    @Column(nullable = false, precision = 8, scale = 5)
    private BigDecimal superannuation;

    @Column(name = "leave_loading", nullable = false, precision = 8, scale = 5)
    private BigDecimal leaveLoading;

    @Column(name = "work_cover", nullable = false, precision = 8, scale = 5)
    private BigDecimal workCover;

    @Column(name = "parental_leave", nullable = false, precision = 8, scale = 5)
    private BigDecimal parentalLeave;

    @Column(name = "long_service_leave", nullable = false, precision = 8, scale = 5)
    private BigDecimal longServiceLeave;

    @Column(name = "annual_leave", nullable = false, precision = 8, scale = 5)
    private BigDecimal annualLeave;

    // Getters and Setters
    public String getStaffType() {
        return staffType;
    }

    public void setStaffType(String staffType) {
        this.staffType = staffType;
    }

    public BigDecimal getSuperannuation() {
        return superannuation;
    }

    public void setSuperannuation(BigDecimal superannuation) {
        this.superannuation = superannuation;
    }

    public BigDecimal getLeaveLoading() {
        return leaveLoading;
    }

    public void setLeaveLoading(BigDecimal leaveLoading) {
        this.leaveLoading = leaveLoading;
    }

    public BigDecimal getWorkCover() {
        return workCover;
    }

    public void setWorkCover(BigDecimal workCover) {
        this.workCover = workCover;
    }

    public BigDecimal getParentalLeave() {
        return parentalLeave;
    }

    public void setParentalLeave(BigDecimal parentalLeave) {
        this.parentalLeave = parentalLeave;
    }

    public BigDecimal getLongServiceLeave() {
        return longServiceLeave;
    }

    public void setLongServiceLeave(BigDecimal longServiceLeave) {
        this.longServiceLeave = longServiceLeave;
    }

    public BigDecimal getAnnualLeave() {
        return annualLeave;
    }

    public void setAnnualLeave(BigDecimal annualLeave) {
        this.annualLeave = annualLeave;
    }
}