package com.itproject.rcpt.jpa.services;

import com.itproject.rcpt.jpa.entities.StaffBenefits;
import com.itproject.rcpt.jpa.repositories.StaffBenefitsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffBenefitsService {

    private final StaffBenefitsRepository repository;

    public StaffBenefitsService(StaffBenefitsRepository repository) {
        this.repository = repository;
    }

    public List<StaffBenefits> getAll() {
        return repository.findAll();
    }

    public StaffBenefits getByStaffType(String staffType) {
        return repository.findById(staffType).orElse(null);
    }

    public StaffBenefits save(StaffBenefits staffBenefits) {
        return repository.save(staffBenefits); // insert or update
    }

    public void delete(String staffType) {
        repository.deleteById(staffType);
    }
}