package com.itproject.rcpt.jpa.services;

import com.itproject.rcpt.jpa.entities.UserPG;
import com.itproject.rcpt.jpa.repositories.UserRepositoryPG;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServicePG {

    private final UserRepositoryPG repository;

    public UserServicePG(UserRepositoryPG repository) {
        this.repository = repository;
    }

    public List<UserPG> getAll() {
        return repository.findAll();
    }

    public UserPG getById(String userId) {
        return repository.findById(userId).orElse(null);
    }

    public UserPG getByEmail(String email) {
        return repository.findByEmail(email);
    }

    public UserPG save(UserPG user) {
        return repository.save(user);
    }

    public void delete(String userId) {
        repository.deleteById(userId);
    }
}