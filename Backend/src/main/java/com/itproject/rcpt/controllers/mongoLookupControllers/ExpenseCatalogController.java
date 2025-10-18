package com.itproject.rcpt.controllers.mongoLookupControllers;

import com.itproject.rcpt.jpa.entities.NonStaffCosts;
import com.itproject.rcpt.jpa.repositories.NonStaffCostsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/meta")
public class ExpenseCatalogController {

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

  @Autowired
  private NonStaffCostsRepository nonStaffCostsRepository;

  @GetMapping("/expense-catalog")
  public List<ExpenseTypeItem> expenseCatalog() {
    List<NonStaffCosts> all = nonStaffCostsRepository.findAll();
    return all.stream()
        .map(n -> new ExpenseTypeItem(
            n.getCostSubcategory(),
            n.getCostSubcategory(),   
            n.getCostCategory()
        ))
        .collect(Collectors.toList());
  }
}
