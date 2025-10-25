package com.itproject.rcpt.jpa.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Region")
public class Region {

    @Id
    @Column(nullable = false)
    private String name;

    @Column(name = "region_code", nullable = false, unique = true)
    private String regionCode;

    // --- Getters and Setters ---
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRegionCode() {
        return regionCode;
    }

    public void setRegionCode(String regionCode) {
        this.regionCode = regionCode;
    }
}