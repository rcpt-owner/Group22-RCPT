package com.itproject.rcpt.domain.value;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;

/** e.g., {year:1, value:0.6} for 60% in year 1 */
public class YearAllocation {
  @Min(1) @Max(10)
  private int year;

  @NotNull
  private Double value; // FTE fraction or quantity per year

  public YearAllocation() { }
  public YearAllocation(int year, Double value) { this.year = year; this.value = value; }

  public int getYear() { return year; }
  public Double getValue() { return value; }
  public void setYear(int year) { this.year = year; }
  public void setValue(Double value) { this.value = value; }
}
