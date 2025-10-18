package com.itproject.rcpt;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.itproject.rcpt.repository.CostCategoryRepository;
import com.itproject.rcpt.repository.ExpenseTypeRepository;
import com.itproject.rcpt.domain.CostCategoryEntity;
import com.itproject.rcpt.domain.ExpenseTypeEntity;

@RestController
@RequestMapping("/api/v1/meta")
public class ExpenseCatalogController {

  public static class CategoryItem {
    public String code;
    public String label;

    public CategoryItem(String code, String label) {
      this.code = code;
      this.label = label;
    }
  }

  public static class ExpenseTypeItem {
    public String code;
    public String label;
    public String categoryCode;

    public ExpenseTypeItem(String code, String label, String categoryCode) {
      this.code = code;
      this.label = label;
      this.categoryCode = categoryCode;
    }
  }

  public static class ExpenseCatalogResponse {
    public List<CategoryItem> categories;
    public List<ExpenseTypeItem> expenseTypes;
  }

  @Autowired
  private CostCategoryRepository costCategoryRepository;

  @Autowired
  private ExpenseTypeRepository expenseTypeRepository;

  @GetMapping("/expense-catalog")
  public ExpenseCatalogResponse expenseCatalog() {
    var res = new ExpenseCatalogResponse();

    // Fetch categories from Postgres
    List<CostCategoryEntity> categories = costCategoryRepository.findAll();
    res.categories = categories.stream()
        .map(c -> new CategoryItem(c.getCode(), c.getLabel()))
        .collect(Collectors.toList());

    // Fetch expense types from Postgres
    List<ExpenseTypeEntity> types = expenseTypeRepository.findAll();
    res.expenseTypes = types.stream()
        .map(e -> new ExpenseTypeItem(e.getCode(), e.getLabel(), e.getCategory().getCode()))
        .collect(Collectors.toList());

    return res;
  }
}
