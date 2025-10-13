package com.ITProject.RCPT.JPA.Repositories;

import com.ITProject.RCPT.JPA.Entities.StaffBenefits;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffBenefitsRepository extends JpaRepository<StaffBenefits, String> {
}