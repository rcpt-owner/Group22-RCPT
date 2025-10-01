package com.ITProject.RCPT.Controllers.LookupControllers;

import com.ITProject.RCPT.Entities.SalaryRate;
import com.ITProject.RCPT.Services.SalaryRateService;
import org.springframework.web.bind.annotation.*;

//TODO: Add all API endpoints

@RestController
@RequestMapping("/api/salary-rates")
public class SalaryRateController {

    private final SalaryRateService service;

    public SalaryRateController(SalaryRateService service) {
        this.service = service;
    }

    @PostMapping
    public SalaryRate create(@RequestBody SalaryRate rate) {
        return service.save(rate);
    }

    @PutMapping("/{id}")
    public SalaryRate update(@PathVariable Long id, @RequestBody SalaryRate rate) {
        rate.setId(id);
        return service.save(rate);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
