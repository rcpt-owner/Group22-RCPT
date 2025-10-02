package com.ITProject.RCPT.Repositories;

import com.ITProject.RCPT.Entities.PayrollTax;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PayrollTaxRepository extends JpaRepository<PayrollTax, Integer> {
}