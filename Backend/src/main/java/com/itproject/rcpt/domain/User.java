package com.itproject.rcpt.domain;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents an authenticated user (via Firebase) stored in MongoDB.
 */
@Document("users")
public class User {

  @Id
  private String id;

  @Indexed(unique = true)
  private String firebaseUid;

  @NotBlank
  @Email
  @Indexed(unique = true)
  private String email;

  /** Human-readable name shown in UI */
  private String displayName;

  /** Structured names */
  private String givenName;
  private String familyName;

  /** Simple role model; ["USER", "APPROVER", "ADMIN"] */
  private Set<String> roles = new LinkedHashSet<>();

  /** Whether the account is active (soft-disable without deletion) */
  private boolean active = true;

  private String department;

  @CreatedDate
  private Instant createdAt;

  @LastModifiedDate
  private Instant updatedAt;

  /** Track last successful login*/
  private Instant lastLoginAt;

  @Version
  private Long version;

  public User() { }

  // --- Getters & Setters ---
  public String getId() { return id; }
  public void setId(String id) { this.id = id; }

  public String getFirebaseUid() { return firebaseUid; }
  public void setFirebaseUid(String firebaseUid) { this.firebaseUid = firebaseUid; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getDisplayName() { return displayName; }
  public void setDisplayName(String displayName) { this.displayName = displayName; }

  public String getGivenName() { return givenName; }
  public void setGivenName(String givenName) { this.givenName = givenName; }

  public String getFamilyName() { return familyName; }
  public void setFamilyName(String familyName) { this.familyName = familyName; }

  public Set<String> getRoles() { return roles; }
  public void setRoles(Set<String> roles) {
    this.roles = (roles == null) ? new LinkedHashSet<>() : new LinkedHashSet<>(roles);
  }

  public boolean isActive() { return active; }
  public void setActive(boolean active) { this.active = active; }

  public String getDepartment() { return department; }
  public void setDepartment(String department) { this.department = department; }

  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

  public Instant getLastLoginAt() { return lastLoginAt; }
  public void setLastLoginAt(Instant lastLoginAt) { this.lastLoginAt = lastLoginAt; }

  public Long getVersion() { return version; }
  public void setVersion(Long version) { this.version = version; }

  // --- Role helpers ---
  public boolean hasRole(String role) {
    if (role == null) return false;
    for (String r : roles) {
      if (role.equalsIgnoreCase(r)) return true;
    }
    return false;
  }

  public void addRole(String role) {
    if (role != null) this.roles.add(role.toUpperCase());
  }

  public void removeRole(String role) {
    if (role == null) return;
    this.roles.removeIf(r -> Objects.equals(r, role) || r.equalsIgnoreCase(role));
  }
}
