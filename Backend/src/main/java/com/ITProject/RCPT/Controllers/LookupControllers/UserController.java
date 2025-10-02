package com.ITProject.RCPT.Controllers.LookupControllers;

import com.ITProject.RCPT.JPA.Entities.User;
import com.ITProject.RCPT.JPA.Services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{userid}")
    public ResponseEntity<User> getUserById(@PathVariable String userid) {
        Optional<User> user = userService.getUserById(userid);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        if (userService.existsByUserid(user.getUserid())) {
            return ResponseEntity.badRequest().build();
        }
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/{userid}")
    public ResponseEntity<User> updateUser(@PathVariable String userid, @RequestBody User user) {
        if (!userService.existsByUserid(userid)) {
            return ResponseEntity.notFound().build();
        }
        user.setUserid(userid);
        User updatedUser = userService.saveUser(user);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{userid}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userid) {
        if (!userService.existsByUserid(userid)) {
            return ResponseEntity.notFound().build();
        }
        userService.deleteUser(userid);
        return ResponseEntity.noContent().build();
    }
}