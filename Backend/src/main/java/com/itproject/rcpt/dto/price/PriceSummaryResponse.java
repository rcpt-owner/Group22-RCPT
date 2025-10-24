package com.itproject.rcpt.dto.price;

import com.itproject.rcpt.dto.common.MoneyDto;

public class PriceSummaryResponse {
  private MoneyDto directStaffCost;
  private MoneyDto directNonStaffCost;
  private MoneyDto indirectCost;
  private MoneyDto totalCost;
  private MoneyDto sponsorPrice;
  private MoneyDto gst;
  private MoneyDto totalPriceInclGst;
  public PriceSummaryResponse() { }
  public MoneyDto getDirectStaffCost() { return directStaffCost; }
  public void setDirectStaffCost(MoneyDto v) { this.directStaffCost = v; }
  public MoneyDto getDirectNonStaffCost() { return directNonStaffCost; }
  public void setDirectNonStaffCost(MoneyDto v) { this.directNonStaffCost = v; }
  public MoneyDto getIndirectCost() { return indirectCost; }
  public void setIndirectCost(MoneyDto v) { this.indirectCost = v; }
  public MoneyDto getTotalCost() { return totalCost; }
  public void setTotalCost(MoneyDto v) { this.totalCost = v; }
  public MoneyDto getSponsorPrice() { return sponsorPrice; }
  public void setSponsorPrice(MoneyDto v) { this.sponsorPrice = v; }
  public MoneyDto getGst() { return gst; }
  public void setGst(MoneyDto v) { this.gst = v; }
  public MoneyDto getTotalPriceInclGst() { return totalPriceInclGst; }
  public void setTotalPriceInclGst(MoneyDto v) { this.totalPriceInclGst = v; }
}
