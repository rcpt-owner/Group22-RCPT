package com.ITProject.RCPT.Controllers.LookupControllers;

import com.ITProject.RCPT.Entities.SalaryRateMultiplier;
import com.ITProject.RCPT.Services.SalaryRateMultiplierService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/salary-rates-multiplier")
public class SalaryRateMultiplierController {

    private final SalaryRateMultiplierService service;

    public SalaryRateMultiplierController(SalaryRateMultiplierService service) {
        this.service = service;
    }

    @GetMapping()
    public List<SalaryRateMultiplier> getAllRates() {
        return service.getAll();
    }

    @GetMapping("/{unit}")
    public SalaryRateMultiplier getRate(@PathVariable String unit) {
        return service.getByUnit(unit);
    }
}

