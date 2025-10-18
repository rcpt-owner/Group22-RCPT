package com.itproject.rcpt.jpa.services;

import com.itproject.rcpt.jpa.entities.SalaryRateMultiplier;
import com.itproject.rcpt.jpa.repositories.SalaryRateMultiplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalaryRateMultiplierService {

    private final SalaryRateMultiplierRepository repository;

    public SalaryRateMultiplierService(SalaryRateMultiplierRepository repository) {
        this.repository = repository;
    }

    public List<SalaryRateMultiplier> getAll() {
        return repository.findAll();
    }

    public SalaryRateMultiplier getByUnit(String unit) {
        return repository.findById(unit).orElse(null);
    }

    public SalaryRateMultiplier save(SalaryRateMultiplier multiplier) {
        return repository.save(multiplier); // insert or update
    }

    public void delete(String unit) {
        repository.deleteById(unit);
    }
}
