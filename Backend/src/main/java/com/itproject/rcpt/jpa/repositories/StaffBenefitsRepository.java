package com.itproject.rcpt.jpa.repositories;

import com.itproject.rcpt.jpa.entities.StaffBenefits;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffBenefitsRepository extends JpaRepository<StaffBenefits, String> {
}