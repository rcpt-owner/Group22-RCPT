package com.itproject.rcpt.controllers.postgresLookupControllers;

import com.itproject.rcpt.jpa.entities.User;
import com.itproject.rcpt.jpa.services.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    // GET all users
    @GetMapping
    public List<User> getAll() {
        return service.getAll();
    }

    // GET user by ID
    @GetMapping("/{id}")
    public User getById(@PathVariable("id") String id) {
        return service.getById(id);
    }

    // GET user by email
    @GetMapping("/email/{email}")
    public User getByEmail(@PathVariable("email") String email) {
        return service.getByEmail(email);
    }

    // POST
    @PostMapping
    public User createOrUpdate(@RequestBody User user) {
        return service.save(user);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") String id) {
        service.delete(id);
    }
}