package com.ITProject.RCPT.JPA.Services;

import com.ITProject.RCPT.JPA.Entities.EBA;
import com.ITProject.RCPT.JPA.Repositories.EBARepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EBAService {

    private final EBARepository repository;

    public EBAService(EBARepository repository) {
        this.repository = repository;
    }

    public List<EBA> getAll() {
        return repository.findAll();
    }

    public EBA getByYear(Integer year) {
        return repository.findById(year).orElse(null);
    }

    public EBA save(EBA eba) {
        return repository.save(eba);
    }

    public void delete(Integer year) {
        repository.deleteById(year);
    }

    public EBARepository getRepository() {
        return repository;
    }
}