package com.ITProject.RCPT.Repositories;

import com.ITProject.RCPT.Entities.SalaryRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaryRateRepository extends JpaRepository<SalaryRate, Long> {
    List<SalaryRate> findByCategory(String category);
    List<SalaryRate> findByPayrollType(String payrollType);
    SalaryRate findByCode(String code);
}
