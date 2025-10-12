package com.ITProject.RCPT.Controllers.LookupControllers;

import com.ITProject.RCPT.JPA.Entities.DepartmentAndFaculty;
import com.ITProject.RCPT.JPA.Services.DepartmentAndFacultyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentAndFacultyController {

    private final DepartmentAndFacultyService service;

    public DepartmentAndFacultyController(DepartmentAndFacultyService service) {
        this.service = service;
    }

    // Get all departments
    @GetMapping()
    public List<String> getDepartments() {
        return service.getDepartments();
    }

    // Get by department
    @GetMapping("/{department}")
    public DepartmentAndFaculty getByDepartment(@PathVariable String department) {
        return service.getByDepartment(department);
    }

    // Create or update a department
    @PostMapping
    public DepartmentAndFaculty createDepartment(@RequestBody DepartmentAndFaculty department) {
        return service.create(department);
    }

    // Delete a department
    @DeleteMapping("/{department}")
    public void deleteDepartment(@PathVariable String department) {
        service.delete(department);
    }
}
