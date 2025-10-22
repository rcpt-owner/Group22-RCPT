package com.itproject.rcpt.controllers.postgresLookupControllers;

import com.itproject.rcpt.jpa.entities.UserPG;
import com.itproject.rcpt.jpa.services.UserServicePG;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserControllerPG {

    private final UserServicePG service;

    public UserControllerPG(UserServicePG service) {
        this.service = service;
    }

    // GET all users
    @GetMapping
    public List<UserPG> getAll() {
        return service.getAll();
    }

    // GET user by ID
    @GetMapping("/{id}")
    public UserPG getById(@PathVariable("id") String id) {
        return service.getById(id);
    }

    // GET user by email
    @GetMapping("/email/{email}")
    public UserPG getByEmail(@PathVariable("email") String email) {
        return service.getByEmail(email);
    }

    // POST
    @PostMapping
    public UserPG createOrUpdate(@RequestBody UserPG user) {
        return service.save(user);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") String id) {
        service.delete(id);
    }
}