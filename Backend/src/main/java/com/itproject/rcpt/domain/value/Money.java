package com.itproject.rcpt.domain.value;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

// can delete if we dont use our simple currency convertor

public class Money {
  @NotNull
  @Field(targetType = FieldType.DECIMAL128)
  private BigDecimal amount;

  @NotBlank
  private String currency; // "AUD", "USD"...

  public Money() { }
  public Money(BigDecimal amount, String currency) { this.amount = amount; this.currency = currency; }

  public BigDecimal getAmount() { return amount; }
  public String getCurrency() { return currency; }
  public void setAmount(BigDecimal amount) { this.amount = amount; }
  public void setCurrency(String currency) { this.currency = currency; }
}
