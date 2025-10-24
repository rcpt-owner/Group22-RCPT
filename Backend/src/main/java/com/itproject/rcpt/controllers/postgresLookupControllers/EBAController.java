package com.itproject.rcpt.controllers.postgresLookupControllers;

import com.itproject.rcpt.jpa.entities.EBA;
import com.itproject.rcpt.jpa.services.EBAService;
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