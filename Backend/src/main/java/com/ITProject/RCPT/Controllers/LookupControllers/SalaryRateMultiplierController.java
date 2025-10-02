package com.ITProject.RCPT.Controllers.LookupControllers;

import com.ITProject.RCPT.Entities.SalaryRateMultiplier;
import com.ITProject.RCPT.Services.SalaryRateMultiplierService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salary-rate-multipliers")
public class SalaryRateMultiplierController {

    private final SalaryRateMultiplierService service;

    public SalaryRateMultiplierController(SalaryRateMultiplierService service) {
        this.service = service;
    }

    // GET all
    @GetMapping
    public List<SalaryRateMultiplier> getAll() {
        return service.getAll();
    }

    // GET by unit
    @GetMapping("/{unit}")
    public SalaryRateMultiplier getByUnit(@PathVariable String unit) {
        return service.getByUnit(unit);
    }

    // POST
    @PostMapping
    public SalaryRateMultiplier createOrUpdate(@RequestBody SalaryRateMultiplier multiplier) {
        return service.save(multiplier);
    }

    // DELETE
    @DeleteMapping("/{unit}")
    public void delete(@PathVariable String unit) {
        service.delete(unit);
    }
}

