package com.itproject.rcpt.enums;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * ExpenseType is a child of CostCategory.
 * - code  : short, stable value used in API payloads
 * - label : human friendly name for UI
 * - category : parent CostCategory (used for validation & filtering)
 *
 * Keep codes stable. You can change labels any time without breaking clients.
 */
public enum ExpenseType {

  // -------- Advertising and marketing --------
  ADV_PROMO("ADV_PROMO", "Advertising, Marketing and Promotional Expenses", CostCategory.ADV),

  // -------- Consumable Goods and Supplies --------
  CONS_GOODS("CONS_GOODS", "Consumable Goods", CostCategory.CONS),
  CONS_LIBRARY("CONS_LIBRARY", "Library", CostCategory.CONS),

  // -------- Data Management --------
  DATA_SW_SERVICES("DATA_SW_SERVICES", "Computer Software and Services (includes Research data)", CostCategory.DATA),

  // -------- Equipment and maintenance and utilities --------
  EQUIP_MAJOR("EQUIP_MAJOR", "Major assets and equipment (>$10,000) / infrastructure costs", CostCategory.EQUIP_UTIL),
  EQUIP_MINOR("EQUIP_MINOR", "Minor Assets and Equipment (Asset < $10,000) Non-Capitalised Equipment", CostCategory.EQUIP_UTIL),
  EQUIP_RENTAL("EQUIP_RENTAL", "Rental and Hire", CostCategory.EQUIP_UTIL),
  EQUIP_REPAIRS("EQUIP_REPAIRS", "Repairs and Maintenance", CostCategory.EQUIP_UTIL),
  EQUIP_UTILITIES("EQUIP_UTILITIES", "Utilities and Services", CostCategory.EQUIP_UTIL),

  // -------- Expert Services and Consultants and Contractors --------
  EXP_CONSULTANTS("EXP_CONSULTANTS", "Consultants", CostCategory.EXPERT),
  EXP_TEMP_LABOUR("EXP_TEMP_LABOUR", "Contracted and Temporary Labour", CostCategory.EXPERT),
  EXP_CONTRACTED_SVC("EXP_CONTRACTED_SVC", "Contracted Services (ex. ICA)", CostCategory.EXPERT),
  EXP_OTHER("EXP_OTHER", "Other expert services", CostCategory.EXPERT),

  // -------- Other consumable service --------
  OCS_OPEN_ACCESS("OCS_OPEN_ACCESS", "Open Access Fees", CostCategory.OTHER_CONS),
  OCS_PROF_MEMBERSHIP("OCS_PROF_MEMBERSHIP", "Professional memberships and subscriptions", CostCategory.OTHER_CONS),

  // -------- PhD Stipends --------
  PHD_OTHER_SUPPORT("PHD_OTHER_SUPPORT", "Other Student Support (includes PhD Stipends/grants)", CostCategory.PHD),

  // -------- Shared Grant Payments --------
  SHARED_HEPS("SHARED_HEPS", "Contributions to HEPS", CostCategory.SHARED),

  // -------- Travel and entertainment --------
  TRAVEL_ENT_CATER("TRAVEL_ENT_CATER", "Entertainment and catering", CostCategory.TRAVEL_ENT),
  TRAVEL_STAFF_CONF("TRAVEL_STAFF_CONF", "Travel, Staff Development, and Conference Expense", CostCategory.TRAVEL_ENT),

  private final String code;
  private final String label;
  private final CostCategory category;

  ExpenseType(String code, String label, CostCategory category) {
    this.code = code;
    this.label = label;
    this.category = category;
  }

  /** Expose the short code in JSON (e.g., "CONS_GOODS"). */
  @JsonValue
  public String getCode() { return code; }

  /** Human-readable label for UI menus. */
  public String getLabel() { return label; }

  /** Parent category (used to validate NonStaffCost.category vs expenseType). */
  public CostCategory getCategory() { return category; }

  public static ExpenseType fromCode(String code) {
    for (ExpenseType e : values()) if (e.code.equalsIgnoreCase(code)) return e;
    throw new IllegalArgumentException("Unknown ExpenseType code: " + code);
  }
}
