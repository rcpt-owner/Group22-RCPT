package com.ITProject.RCPT.Repositories;

import com.ITProject.RCPT.Entities.StaffBenefits;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffBenefitsRepository extends JpaRepository<StaffBenefits, String> {
}