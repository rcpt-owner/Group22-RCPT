package com.itproject.rcpt.domain;

package com.itproject.rcpt.domain.value.Money;

public class PriceSummary {

  private Money directStaffCost;     // before multipliers
  private Money directNonStaffCost;  // before multipliers
  private Money indirectCost;        // overheads
  private Money totalCost;           // includes in-kind
  private Money sponsorPrice;        // excludes in-kind
  private Money gst;                 // if applicable
  private Money totalPriceInclGst;

  public PriceSummary() { }

  public Money getDirectStaffCost() { return directStaffCost; }
  public void setDirectStaffCost(Money directStaffCost) { this.directStaffCost = directStaffCost; }

  public Money getDirectNonStaffCost() { return directNonStaffCost; }
  public void setDirectNonStaffCost(Money directNonStaffCost) { this.directNonStaffCost = directNonStaffCost; }

  public Money getIndirectCost() { return indirectCost; }
  public void setIndirectCost(Money indirectCost) { this.indirectCost = indirectCost; }

  public Money getTotalCost() { return totalCost; }
  public void setTotalCost(Money totalCost) { this.totalCost = totalCost; }

  public Money getSponsorPrice() { return sponsorPrice; }
  public void setSponsorPrice(Money sponsorPrice) { this.sponsorPrice = sponsorPrice; }

  public Money getGst() { return gst; }
  public void setGst(Money gst) { this.gst = gst; }

  public Money getTotalPriceInclGst() { return totalPriceInclGst; }
  public void setTotalPriceInclGst(Money totalPriceInclGst) { this.totalPriceInclGst = totalPriceInclGst; }
}
