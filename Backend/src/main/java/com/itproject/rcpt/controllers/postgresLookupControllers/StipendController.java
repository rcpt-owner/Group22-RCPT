package com.itproject.rcpt.controllers.postgresLookupControllers;

import com.itproject.rcpt.jpa.entities.Stipend;
import com.itproject.rcpt.jpa.services.StipendService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stipends")
public class StipendController {

    private final StipendService service;

    public StipendController(StipendService service) {
        this.service = service;
    }

    // GET all
    @GetMapping
    public List<Stipend> getAll() {
        return service.getAll();
    }

    // GET by year
    @GetMapping("/{year}")
    public Stipend getByYear(@PathVariable Integer year) {
        return service.getByYear(year);
    }

    // POST
    @PostMapping
    public Stipend createOrUpdate(@RequestBody Stipend stipend) {
        return service.save(stipend);
    }

    // DELETE
    @DeleteMapping("/{year}")
    public void delete(@PathVariable Integer year) {
        service.delete(year);
    }
}