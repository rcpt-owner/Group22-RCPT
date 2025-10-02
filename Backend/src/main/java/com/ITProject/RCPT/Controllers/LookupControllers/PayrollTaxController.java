package com.ITProject.RCPT.Controllers.LookupControllers;

import com.ITProject.RCPT.Entities.PayrollTax;
import com.ITProject.RCPT.Services.PayrollTaxService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll-tax")
public class PayrollTaxController {

    private final PayrollTaxService service;

    public PayrollTaxController(PayrollTaxService service) {
        this.service = service;
    }

    // GET all
    @GetMapping
    public List<PayrollTax> getAll() {
        return service.getAll();
    }

    // GET by year
    @GetMapping("/{year}")
    public PayrollTax getByYear(@PathVariable Integer year) {
        return service.getByYear(year);
    }

    // POST
    @PostMapping
    public PayrollTax createOrUpdate(@RequestBody PayrollTax payrollTax) {
        return service.save(payrollTax);
    }

    // DELETE
    @DeleteMapping("/{year}")
    public void delete(@PathVariable Integer year) {
        service.delete(year);
    }
}