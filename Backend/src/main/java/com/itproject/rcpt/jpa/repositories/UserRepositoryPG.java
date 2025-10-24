package com.itproject.rcpt.jpa.repositories;

import com.itproject.rcpt.jpa.entities.UserPG;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepositoryPG extends JpaRepository<UserPG, String> {
    UserPG findByEmail(String email);
}