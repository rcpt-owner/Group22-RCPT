package com.ITProject.RCPT.Repositories;

import com.ITProject.RCPT.Entities.Stipend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StipendRepository extends JpaRepository<Stipend, Integer> {
}