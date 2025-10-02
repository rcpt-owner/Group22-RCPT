package com.ITProject.RCPT.JPA.Repositories;

import com.ITProject.RCPT.JPA.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUserid(String userid);

    boolean existsByEmail(String email);

    boolean existsByUserid(String userid);
}
