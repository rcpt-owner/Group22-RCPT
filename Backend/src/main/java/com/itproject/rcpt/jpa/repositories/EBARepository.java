package com.itproject.rcpt.jpa.repositories;

import com.itproject.rcpt.jpa.entities.EBA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EBARepository extends JpaRepository<EBA, Integer> {
}