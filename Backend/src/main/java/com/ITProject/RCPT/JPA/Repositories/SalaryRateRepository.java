package com.ITProject.RCPT.JPA.Repositories;

import com.ITProject.RCPT.JPA.Entities.SalaryRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalaryRateRepository extends JpaRepository<SalaryRate, String> {
}
