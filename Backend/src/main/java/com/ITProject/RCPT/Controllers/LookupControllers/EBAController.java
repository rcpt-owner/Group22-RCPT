package com.ITProject.RCPT.Controllers.LookupControllers;

import com.ITProject.RCPT.Entities.EBA;
import com.ITProject.RCPT.Services.EBAService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eba")
public class EBAController {

    private final EBAService service;

    public EBAController(EBAService service) {
        this.service = service;
    }

    // GET all
    @GetMapping
    public List<EBA> getAll() {
        return service.getAll();
    }

    // GET by year
    @GetMapping("/{year}")
    public EBA getByYear(@PathVariable Integer year) {
        return service.getByYear(year);
    }

    // POST
    @PostMapping
    public EBA createOrUpdate(@RequestBody EBA eba) {
        return service.save(eba);
    }

    // DELETE
    @DeleteMapping("/{year}")
    public void delete(@PathVariable Integer year) {
        service.delete(year);
    }
}