package com.ITProject.RCPT.Controllers.LookupControllers;

import com.ITProject.RCPT.JPA.Entities.Region;
import com.ITProject.RCPT.JPA.Services.RegionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/regions")
public class RegionController {

    private final RegionService service;

    public RegionController(RegionService service) {
        this.service = service;
    }

    // GET all
    @GetMapping
    public List<Region> getAllRegions() {
        return service.getAll();
    }

    // GET by Name
    @GetMapping("/{name}")
    public Region getRegionByName(@PathVariable String name) {
        return service.getByName(name);
    }


    // POST = create
    @PostMapping
    public Region createRegion(@RequestBody Region region) {
        return service.create(region);
    }


    // DELETE
    @DeleteMapping("/{id}")
    public void deleteRegion(@PathVariable String name) {
        service.delete(name);
    }
}
