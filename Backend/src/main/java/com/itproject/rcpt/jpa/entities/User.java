package com.itproject.rcpt.jpa.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "userid", nullable = false, unique = true)
    private String userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "is_admin", nullable = false)
    private boolean isAdmin;

    @Column(name = "is_approver", nullable = false)
    private boolean isApprover;

    // Constructor
    public User() {}

    // Getters & Setters
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public boolean getIsAdmin() {
        return isAdmin;
    }
    public void setIsAdmin(boolean admin) {
        isAdmin = admin;
    }

    public boolean getIsApprover() {
        return isApprover;
    }
    public void setIsApprover(boolean approver) {
        isApprover = approver;
    }
}