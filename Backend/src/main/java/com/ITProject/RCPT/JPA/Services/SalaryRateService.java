package com.ITProject.RCPT.JPA.Services;

import com.ITProject.RCPT.JPA.Entities.SalaryRate;
import com.ITProject.RCPT.JPA.Repositories.SalaryRateRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalaryRateService {

    private final SalaryRateRepository repository;

    public SalaryRateService(SalaryRateRepository repository) {
        this.repository = repository;
    }

    public List<SalaryRate> getAll() {
        return repository.findAll();
    }

    public SalaryRate getByCode(String code) {
        return repository.findById(code).orElse(null);
    }

    public SalaryRate save(SalaryRate salaryRate) {
        return repository.save(salaryRate); // insert or update
    }

    public void delete(String code) {
        repository.deleteById(code);
    }
}
