package com.ITProject.RCPT.Controllers.LookupControllers;

import com.ITProject.RCPT.JPA.Entities.StaffBenefits;
import com.ITProject.RCPT.JPA.Services.StaffBenefitsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff-benefits")
public class StaffBenefitsController {

    private final StaffBenefitsService service;

    public StaffBenefitsController(StaffBenefitsService service) {
        this.service = service;
    }

    // GET all
    @GetMapping
    public List<StaffBenefits> getAll() {
        return service.getAll();
    }

    // GET by staff type
    @GetMapping("/{staffType}")
    public StaffBenefits getByStaffType(@PathVariable String staffType) {
        return service.getByStaffType(staffType);
    }

    // POST
    @PostMapping
    public StaffBenefits createOrUpdate(@RequestBody StaffBenefits staffBenefits) {
        return service.save(staffBenefits);
    }

    // DELETE
    @DeleteMapping("/{staffType}")
    public void delete(@PathVariable String staffType) {
        service.delete(staffType);
    }
}
