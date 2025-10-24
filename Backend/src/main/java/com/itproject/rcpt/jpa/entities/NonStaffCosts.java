package com.itproject.rcpt.jpa.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "non_staff_costs")
public class NonStaffCosts {

    @Id
    @Column(name = "cost_subcategory", nullable = false)
    private String costSubcategory;

    @Column(name = "cost_category", nullable = false)
    private String costCategory;

    // Constructors
    public NonStaffCosts() {}

    public NonStaffCosts(String costSubcategory, String costCategory) {
        this.costSubcategory = costSubcategory;
        this.costCategory = costCategory;
    }

    // Getters and setters
    public String getCostSubcategory() {
        return costSubcategory;
    }

    public void setCostSubcategory(String costSubcategory) {
        this.costSubcategory = costSubcategory;
    }

    public String getCostCategory() {
        return costCategory;
    }

    public void setCostCategory(String costCategory) {
        this.costCategory = costCategory;
    }
}
