package com.itproject.rcpt.domain;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;

public class ProjectDetails {

  @NotBlank
  private String title;

  @NotBlank
  private String funder;

  @NotBlank
  private String department;

  /** ISO 4217 code, e.g., "AUD" */
  @NotBlank
  private String currency;

  private String referenceCode;
  private LocalDate startDate;
  private LocalDate endDate;

  public ProjectDetails() { }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getFunder() { return funder; }
  public void setFunder(String funder) { this.funder = funder; }

  public String getDepartment() { return department; }
  public void setDepartment(String department) { this.department = department; }

  public String getCurrency() { return currency; }
  public void setCurrency(String currency) { this.currency = currency; }

  public String getReferenceCode() { return referenceCode; }
  public void setReferenceCode(String referenceCode) { this.referenceCode = referenceCode; }

  public LocalDate getStartDate() { return startDate; }
  public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

  public LocalDate getEndDate() { return endDate; }
  public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
}
 