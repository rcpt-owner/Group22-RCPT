package com.ITProject.RCPT.Repositorys;

import com.ITProject.RCPT.Entities.SalaryRateMultiplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalaryRateMultiplierRepository extends JpaRepository<SalaryRateMultiplier, String> {
    SalaryRateMultiplier findByUnit(String unit);
}

