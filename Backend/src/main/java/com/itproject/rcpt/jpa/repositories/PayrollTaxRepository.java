package com.itproject.rcpt.jpa.repositories;

import com.itproject.rcpt.jpa.entities.PayrollTax;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PayrollTaxRepository extends JpaRepository<PayrollTax, Integer> {
}