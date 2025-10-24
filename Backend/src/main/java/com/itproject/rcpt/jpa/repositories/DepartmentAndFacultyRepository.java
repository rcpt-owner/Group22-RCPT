package com.itproject.rcpt.jpa.repositories;

import com.itproject.rcpt.jpa.entities.DepartmentAndFaculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentAndFacultyRepository extends JpaRepository<DepartmentAndFaculty, String> {

    @Query(value = "SELECT department FROM department_and_faculty", nativeQuery = true)
    List<String> findAllDepartments();
}
