package com.itproject.rcpt.controllers.mongoLookupControllers;

import java.util.Optional;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.itproject.rcpt.domain.User;
import com.itproject.rcpt.repository.UserRepository;

@RestController
@RequestMapping("/api/v1/users")
@Validated
public class UserController {

  private final UserRepository users;

  public UserController(UserRepository users) {
    this.users = users;
  }

  // ---------- DTOs ----------

  public static class CreateUserRequest {
    @NotBlank @Email public String email;
    public String displayName;
    public String givenName;
    public String familyName;
    public String department;
  }

  public static class UpdateUserRequest {
    public String displayName;
    public String givenName;
    public String familyName;
    public String department;
    public Boolean active;
    public java.util.Set<String> roles;
  }

  public static class RoleRequest {
    @NotBlank public String role;
  }

  // ---------- Read ----------

  @GetMapping("{id}")
  public ResponseEntity<User> get(@PathVariable String id) {
    return users.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping
  public Page<User> list(@RequestParam(defaultValue = "0") int page,
                         @RequestParam(defaultValue = "20") int size) {
    return users.findAll(PageRequest.of(page, size));
  }

  @GetMapping("by-email")
  public ResponseEntity<User> byEmail(@RequestParam @Email String email) {
    Optional<User> u = users.findByEmail(email);
    return u.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  // ---------- Create ----------

  @PostMapping
  public ResponseEntity<?> create(@Valid @RequestBody CreateUserRequest req) {
    if (users.existsByEmail(req.email)) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
                           .body("Email already exists");
    }
    User u = new User();
    u.setEmail(req.email);
    u.setDisplayName(req.displayName);
    u.setGivenName(req.givenName);
    u.setFamilyName(req.familyName);
    u.setDepartment(req.department);
    // roles default empty, active=true in domain
    User saved = users.save(u);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
  }

  // ---------- Update ----------

  @PatchMapping("{id}")
  public ResponseEntity<?> update(@PathVariable String id,
                                  @Valid @RequestBody UpdateUserRequest req) {
    User u = users.findById(id).orElse(null);
    if (u == null) return ResponseEntity.notFound().build();

    if (req.displayName != null) u.setDisplayName(req.displayName);
    if (req.givenName != null)   u.setGivenName(req.givenName);
    if (req.familyName != null)  u.setFamilyName(req.familyName);
    if (req.department != null)  u.setDepartment(req.department);
    if (req.active != null)      u.setActive(req.active.booleanValue());
    if (req.roles != null)       u.setRoles(req.roles);

    return ResponseEntity.ok(users.save(u));
  }

  // ---------- Activate / Deactivate ----------

  @PostMapping("{id}/activate")
  public ResponseEntity<?> activate(@PathVariable String id) {
    User u = users.findById(id).orElse(null);
    if (u == null) return ResponseEntity.notFound().build();
    u.setActive(true);
    return ResponseEntity.ok(users.save(u));
  }

  @PostMapping("{id}/deactivate")
  public ResponseEntity<?> deactivate(@PathVariable String id) {
    User u = users.findById(id).orElse(null);
    if (u == null) return ResponseEntity.notFound().build();
    u.setActive(false);
    return ResponseEntity.ok(users.save(u));
  }

  // ---------- Roles ----------

  @PostMapping("{id}/roles")
  public ResponseEntity<?> addRole(@PathVariable String id, @Valid @RequestBody RoleRequest body) {
    User u = users.findById(id).orElse(null);
    if (u == null) return ResponseEntity.notFound().build();
    u.addRole(body.role);
    return ResponseEntity.ok(users.save(u));
  }

  @DeleteMapping("{id}/roles/{role}")
  public ResponseEntity<?> removeRole(@PathVariable String id, @PathVariable String role) {
    User u = users.findById(id).orElse(null);
    if (u == null) return ResponseEntity.notFound().build();
    u.removeRole(role);
    return ResponseEntity.ok(users.save(u));
  }

  // ---------- Delete ----------

  @DeleteMapping("{id}")
  public ResponseEntity<Void> delete(@PathVariable String id) {
    if (!users.existsById(id)) return ResponseEntity.notFound().build();
    users.deleteById(id);
    return ResponseEntity.noContent().build();
  }
}
