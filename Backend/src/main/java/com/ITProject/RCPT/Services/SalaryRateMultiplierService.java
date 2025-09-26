package com.ITProject.RCPT.Services;

import com.ITProject.RCPT.Entities.SalaryRateMultiplier;
import com.ITProject.RCPT.Repositorys.SalaryRateMultiplierRepository;
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
        return repository.findByUnit(unit);
    }

    public SalaryRateMultiplier save(SalaryRateMultiplier rate) {
        return repository.save(rate);
    }
}
