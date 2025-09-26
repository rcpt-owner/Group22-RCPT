package com.ITProject.RCPT.Services;

import com.ITProject.RCPT.Entities.SalaryRate;
import com.ITProject.RCPT.Repositories.SalaryRateRepository;
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
        return repository.findByCode(code);
    }

    public List<SalaryRate> getByCategory(String category) {
        return repository.findByCategory(category);
    }

    public List<SalaryRate> getByPayrollType(String payrollType) {
        return repository.findByPayrollType(payrollType);
    }

    public SalaryRate save(SalaryRate rate) {
        return repository.save(rate);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
