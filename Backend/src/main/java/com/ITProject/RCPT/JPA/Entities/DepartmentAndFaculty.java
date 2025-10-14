package com.ITProject.RCPT.JPA.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "department_and_faculty")
public class DepartmentAndFaculty {

    @Id
    @Column(name = "department", nullable = false)
    private String department;

    @Column(name = "dept_code")
    private String deptCode;

    @Column(name = "school")
    private String school;

    @Column(name = "school_code")
    private String schoolCode;

    @Column(name = "faculty")
    private String faculty;

    @Column(name = "faculty_code")
    private String facultyCode;

    // --- Getters and Setters ---
    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDeptCode() {
        return deptCode;
    }

    public void setDeptCode(String deptCode) {
        this.deptCode = deptCode;
    }

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public String getSchoolCode() {
        return schoolCode;
    }

    public void setSchoolCode(String schoolCode) {
        this.schoolCode = schoolCode;
    }

    public String getFacultyCode() {
        return facultyCode;
    }

    public void setFacultyCode(String facultyCode) {
        this.facultyCode = facultyCode;
    }

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }
}