package com.itproject.rcpt.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum CostCategory {
  ADV("ADV", "Advertising and marketing"),
  CONS("CONS", "Consumable Goods and Supplies"),
  DATA("DATA", "Data Management"),
  EQUIP_UTIL("EQUIP_UTIL", "Equipment and maintenance and utilities"),
  EXPERT("EXPERT", "Expert Services and Consultants and Contractors"),
  OTHER_CONS("OTHER_CONS", "Other consumable service"),
  PHD("PHD", "PhD Stipends"),
  SHARED("SHARED", "Shared Grant Payments"),
  TRAVEL_ENT("TRAVEL_ENT", "Travel and entertainment"),

  private final String code;
  private final String label;

  CostCategory(String code, String label) {
    this.code = code; this.label = label;
  }

  @JsonValue public String getCode() { return code; }
  public String getLabel() { return label; }

  public static CostCategory fromCode(String code) {
    for (var c : values()) if (c.code.equalsIgnoreCase(code)) return c;
    throw new IllegalArgumentException("Unknown CostCategory: " + code);
  }
}
