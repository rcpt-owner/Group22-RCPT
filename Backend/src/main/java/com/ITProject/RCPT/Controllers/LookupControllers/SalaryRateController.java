package com.ITProject.RCPT.Controllers.LookupControllers;

import com.ITProject.RCPT.JPA.Entities.SalaryRate;
import com.ITProject.RCPT.JPA.Services.SalaryRateService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salary-rates")
public class SalaryRateController {

    private final SalaryRateService service;

    public SalaryRateController(SalaryRateService service) {
        this.service = service;
    }

    // GET all
    @GetMapping
    public List<SalaryRate> getAll() {
        return service.getAll();
    }

    // GET by code
    @GetMapping("/{code}")
    public SalaryRate getByCode(@PathVariable String code) {
        return service.getByCode(code);
    }

    // POST
    @PostMapping
    public SalaryRate createOrUpdate(@RequestBody SalaryRate salaryRate) {
        return service.save(salaryRate);
    }

    // DELETE
    @DeleteMapping("/{code}")
    public void delete(@PathVariable String code) {
        service.delete(code);
    }
}