package com.itproject.rcpt.jpa.services;

import com.itproject.rcpt.jpa.entities.PayrollTax;
import com.itproject.rcpt.jpa.repositories.PayrollTaxRepository;
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