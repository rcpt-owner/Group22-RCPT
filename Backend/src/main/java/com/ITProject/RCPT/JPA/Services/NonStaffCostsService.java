package com.ITProject.RCPT.JPA.Services;

import com.ITProject.RCPT.JPA.Entities.NonStaffCosts;
import com.ITProject.RCPT.JPA.Repositories.NonStaffCostsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NonStaffCostsService {

    private final NonStaffCostsRepository repository;

    public NonStaffCostsService(NonStaffCostsRepository repository) {
        this.repository = repository;
    }

    public List<NonStaffCosts> getAll() {
        return repository.findAll();
    }

    public NonStaffCosts getBySubcategory(String subcategory) {
        return repository.findById(subcategory).orElse(null);
    }

    public NonStaffCosts save(NonStaffCosts cost) {
        return repository.save(cost);
    }

    public void delete(String subcategory) {
        repository.deleteById(subcategory);
    }
}
