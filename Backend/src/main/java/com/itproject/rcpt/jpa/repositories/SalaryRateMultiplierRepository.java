package com.itproject.rcpt.jpa.repositories;

import com.itproject.rcpt.jpa.entities.SalaryRateMultiplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalaryRateMultiplierRepository extends JpaRepository<SalaryRateMultiplier, String> {
}

