package com.itproject.rcpt.dto.common;

import java.math.BigDecimal;

public class MoneyDto {
  private BigDecimal amount;
  private String currency;
  public MoneyDto() { }
  public BigDecimal getAmount() { return amount; }
  public void setAmount(BigDecimal amount) { this.amount = amount; }
  public String getCurrency() { return currency; }
  public void setCurrency(String currency) { this.currency = currency; }
}
