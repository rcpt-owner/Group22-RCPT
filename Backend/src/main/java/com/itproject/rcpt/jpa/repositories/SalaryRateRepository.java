package com.itproject.rcpt.jpa.repositories;

import com.itproject.rcpt.jpa.entities.SalaryRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalaryRateRepository extends JpaRepository<SalaryRate, String> {
}
