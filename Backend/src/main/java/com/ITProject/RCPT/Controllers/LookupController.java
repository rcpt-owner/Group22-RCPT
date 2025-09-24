package com.ITProject.RCPT.Controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class LookupController {


    //TODO: Fill in SQL logic and change return type too correct JPA type for all

    // salary_rate_multiplier table
    @GetMapping("/lookup/employment-types")
    public String getEmploymentTypes() {
        // Return employment types from salary_rate_multiplier table
        return "";
    }

    // salary_rate table
    @GetMapping("/lookup/payroll-types")
    public String getPayrollTypes() {
        // Return payroll types from salary_rate table
        return  "";
    }

    @GetMapping("/lookup/category-types")
    public String getCategoryTypes() {
        // Return category types from salary_rate table
        return "";
    }

    @GetMapping("/lookup/hourly-rates")
    public String getHourlyRate() {
        // Return hourly rates from salary_rate table
        return  "";
    }

    @GetMapping("/lookup/daily-rates")
    public String getDailyRates() {
        // Return daily rates from salary_rate table
        return  "";
    }

    // staff_benefits table

    // region table

    // eba_increase table

    // post_grad_stipend table

    // payroll_tax table

    // department and faculties table

    // region table
}
