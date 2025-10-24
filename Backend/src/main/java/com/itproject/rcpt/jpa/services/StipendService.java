package com.itproject.rcpt.jpa.services;

import com.itproject.rcpt.jpa.entities.Stipend;
import com.itproject.rcpt.jpa.repositories.StipendRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StipendService {

    private final StipendRepository repository;

    public StipendService(StipendRepository repository) {
        this.repository = repository;
    }

    // Get all rows
    public List<Stipend> getAll() {
        return repository.findAll();
    }

    // Get by year
    public Stipend getByYear(Integer year) {
        return repository.findById(year).orElse(null);
    }

    // Create or update
    public Stipend save(Stipend stipend) {
        return repository.save(stipend);
    }

    // Delete by year
    public void delete(Integer year) {
        repository.deleteById(year);
    }

    public StipendRepository getRepository() {
        return repository;
    }
}