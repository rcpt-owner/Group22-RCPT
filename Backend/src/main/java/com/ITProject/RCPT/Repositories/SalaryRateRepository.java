package com.ITProject.RCPT.Repositories;

import com.ITProject.RCPT.Entities.SalaryRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalaryRateRepository extends JpaRepository<SalaryRate, String> {
}
