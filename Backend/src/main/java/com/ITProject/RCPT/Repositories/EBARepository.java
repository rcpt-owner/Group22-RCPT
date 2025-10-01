package com.ITProject.RCPT.Repositories;

import com.ITProject.RCPT.Entities.EBA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EBARepository extends JpaRepository<EBA, Integer> {
}