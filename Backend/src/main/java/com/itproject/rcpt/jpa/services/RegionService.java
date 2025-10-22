package com.itproject.rcpt.jpa.services;

import com.itproject.rcpt.jpa.entities.Region;
import com.itproject.rcpt.jpa.repositories.RegionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegionService {

    private final RegionRepository repository;

    public RegionService(RegionRepository repository) {
        this.repository = repository;
    }

    // Get all regions
    public List<Region> getAll() {
        return repository.findAll();
    }

    // Get by Name
    public Region getByName(String name) {
        return repository.getByName(name);
    }


    // Create new region
    public Region create(Region region) {
        return repository.save(region);
    }


    // Delete region
    public void delete(String name) {
        repository.deleteById(name);
    }
}