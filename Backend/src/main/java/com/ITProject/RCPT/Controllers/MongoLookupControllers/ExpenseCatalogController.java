package com.itproject.rcpt;

import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.*;

import com.uom.rcpt.enums.CostCategory;
import com.uom.rcpt.enums.ExpenseType;

@RestController
@RequestMapping("/api/v1/meta")
public class ExpenseCatalogController {

  public static class CategoryItem {
    public String code; public String label;
    public CategoryItem(String code, String label) { this.code = code; this.label = label; }
  }
  public static class ExpenseTypeItem {
    public String code; public String label; public String categoryCode;
    public ExpenseTypeItem(String code, String label, String categoryCode) {
      this.code = code; this.label = label; this.categoryCode = categoryCode;
    }
  }
  public static class ExpenseCatalogResponse {
    public List<CategoryItem> categories;
    public List<ExpenseTypeItem> expenseTypes;
  }

  @GetMapping("expense-catalog")
  public ExpenseCatalogResponse expenseCatalog() {
    var res = new ExpenseCatalogResponse();

    res.categories = new ArrayList<>();
    for (CostCategory c : CostCategory.values())
      res.categories.add(new CategoryItem(c.getCode(), c.getLabel()));

    res.expenseTypes = new ArrayList<>();
    for (ExpenseType e : ExpenseType.values())
      res.expenseTypes.add(new ExpenseTypeItem(e.getCode(), e.getLabel(), e.getCategory().getCode()));

    return res;
  }
}
