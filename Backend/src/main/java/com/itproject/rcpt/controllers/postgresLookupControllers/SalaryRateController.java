package com.itproject.rcpt.controllers.postgresLookupControllers;

import com.itproject.rcpt.jpa.entities.SalaryRate;
import com.itproject.rcpt.jpa.services.SalaryRateService;
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