package com.itproject.rcpt.jpa.repositories;

import com.itproject.rcpt.jpa.entities.Stipend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StipendRepository extends JpaRepository<Stipend, Integer> {
}