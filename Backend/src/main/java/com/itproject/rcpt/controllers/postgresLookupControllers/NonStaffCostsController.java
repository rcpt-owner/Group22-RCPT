package com.itproject.rcpt.controllers.postgresLookupControllers;

import com.itproject.rcpt.jpa.entities.NonStaffCosts;
import com.itproject.rcpt.jpa.services.NonStaffCostsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/non-staff-costs")
public class NonStaffCostsController {

    private final NonStaffCostsService service;

    public NonStaffCostsController(NonStaffCostsService service) {
        this.service = service;
    }

    // GET all
    @GetMapping
    public List<NonStaffCosts> getAll() {
        return service.getAll();
    }

    // GET by subcategory
    @GetMapping("/{subcategory}")
    public NonStaffCosts getBySubcategory(@PathVariable String subcategory) {
        return service.getBySubcategory(subcategory);
    }

    // POST
    @PostMapping
    public NonStaffCosts createOrUpdate(@RequestBody NonStaffCosts cost) {
        return service.save(cost);
    }

    // DELETE
    @DeleteMapping("/{subcategory}")
    public void delete(@PathVariable String subcategory) {
        service.delete(subcategory);
    }
}
