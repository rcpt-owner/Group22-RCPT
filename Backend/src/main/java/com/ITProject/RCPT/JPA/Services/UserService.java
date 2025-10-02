package com.ITProject.RCPT.JPA.Services;

import com.ITProject.RCPT.JPA.Entities.User;
import com.ITProject.RCPT.JPA.Repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String userid) {
        return userRepository.findByUserid(userid);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(String userid) {
        userRepository.deleteById(userid);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUserid(String userid) {
        return userRepository.existsByUserid(userid);
    }
}
