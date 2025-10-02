package com.ITProject.RCPT.Services;

import com.ITProject.RCPT.Entities.PayrollTax;
import com.ITProject.RCPT.Repositories.PayrollTaxRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PayrollTaxService {

    private final PayrollTaxRepository repository;

    public PayrollTaxService(PayrollTaxRepository repository) {
        this.repository = repository;
    }

    public List<PayrollTax> getAll() {
        return repository.findAll();
    }

    public PayrollTax getByYear(Integer year) {
        return repository.findById(year).orElse(null);
    }

    public PayrollTax save(PayrollTax payrollTax) {
        return repository.save(payrollTax); // insert or update
    }

    public void delete(Integer year) {
        repository.deleteById(year);
    }
}