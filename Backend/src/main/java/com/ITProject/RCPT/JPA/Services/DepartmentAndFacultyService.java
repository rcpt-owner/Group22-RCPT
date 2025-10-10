package com.ITProject.RCPT.JPA.Services;

import com.ITProject.RCPT.JPA.Entities.DepartmentAndFaculty;
import com.ITProject.RCPT.JPA.Repositories.DepartmentAndFacultyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentAndFacultyService {

    private final DepartmentAndFacultyRepository repository;

    public DepartmentAndFacultyService(DepartmentAndFacultyRepository repository) {
        this.repository = repository;
    }

    public List<DepartmentAndFaculty> getAll() {
        return repository.findAll();
    }

    public DepartmentAndFaculty getByDepartment(String department) {
        return repository.findById(department).orElse(null);
    }

    public List<String> getDepartments() {
        return repository.findAllDepartments();
    }

    public DepartmentAndFaculty create(DepartmentAndFaculty dept) {
        return repository.save(dept);
    }

    public void delete(String department) {
        repository.deleteById(department);
    }
}
