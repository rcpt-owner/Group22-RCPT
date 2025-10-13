package com.ITProject.RCPT.JPA.Repositories;

import com.ITProject.RCPT.JPA.Entities.Stipend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StipendRepository extends JpaRepository<Stipend, Integer> {
}