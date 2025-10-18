package com.itproject.rcpt.jpa.services;

import com.itproject.rcpt.jpa.entities.User;
import com.itproject.rcpt.jpa.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<User> getAll() {
        return repository.findAll();
    }

    public User getById(String userId) {
        return repository.findById(userId).orElse(null);
    }

    public User getByEmail(String email) {
        return repository.findByEmail(email);
    }

    public User save(User user) {
        return repository.save(user);
    }

    public void delete(String userId) {
        repository.deleteById(userId);
    }
}