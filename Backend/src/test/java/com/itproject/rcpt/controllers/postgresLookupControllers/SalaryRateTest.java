package com.itproject.rcpt.controllers.postgresLookupControllers;

import com.itproject.rcpt.jpa.entities.SalaryRate;
import com.itproject.rcpt.jpa.services.SalaryRateService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SalaryRateTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SalaryRateService service;

    @AfterEach
    void cleanup() {
        service.delete("CODE1");
        service.delete("CODE2");
    }

    @Test
    void testGetAll() throws Exception {
        SalaryRate r1 = new SalaryRate();
        r1.setCode("CODE1");
        r1.setName("Academic Staff");
        r1.setPayrollType("Fortnight");
        r1.setCategory("Academic");
        r1.setFteRate(new BigDecimal("100.00"));
        r1.setDailyRate(new BigDecimal("200.00"));
        r1.setHourlyRate(new BigDecimal("25.00"));
        service.save(r1);

        SalaryRate r2 = new SalaryRate();
        r2.setCode("CODE2");
        r2.setName("Professional Staff");
        r2.setPayrollType("Casual");
        r2.setCategory("Professional");
        r2.setFteRate(new BigDecimal("120.00"));
        r2.setDailyRate(new BigDecimal("250.00"));
        r2.setHourlyRate(new BigDecimal("30.00"));
        service.save(r2);

        mockMvc.perform(get("/api/salary-rates"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].code", is("CODE1")))
                .andExpect(jsonPath("$[1].code", is("CODE2")));
    }

    @Test
    void testGetByCode() throws Exception {
        SalaryRate rate = new SalaryRate();
        rate.setCode("CODE2");
        rate.setName("Professional Staff");
        rate.setPayrollType("Casual");
        rate.setCategory("Professional");
        rate.setFteRate(new BigDecimal("120.00"));
        rate.setDailyRate(new BigDecimal("250.00"));
        rate.setHourlyRate(new BigDecimal("30.00"));
        service.save(rate);

        mockMvc.perform(get("/api/salary-rates/CODE2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is("CODE2")))
                .andExpect(jsonPath("$.name", is("Professional Staff")))
                .andExpect(jsonPath("$.payrollType", is("Casual")))
                .andExpect(jsonPath("$.category", is("Professional")))
                .andExpect(jsonPath("$.fteRate", is(120.00)))
                .andExpect(jsonPath("$.dailyRate", is(250.00)))
                .andExpect(jsonPath("$.hourlyRate", is(30.00)));
    }

    @Test
    void testPost() throws Exception {
        String json = """
                {
                    "code": "CODE1",
                    "name": "Academic Staff",
                    "payrollType": "Fortnight",
                    "category": "Academic",
                    "fteRate": 100.00,
                    "dailyRate": 200.00,
                    "hourlyRate": 25.00
                }
                """;

        mockMvc.perform(post("/api/salary-rates")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is("CODE1")))
                .andExpect(jsonPath("$.name", is("Academic Staff")))
                .andExpect(jsonPath("$.payrollType", is("Fortnight")))
                .andExpect(jsonPath("$.category", is("Academic")))
                .andExpect(jsonPath("$.fteRate", is(100.00)))
                .andExpect(jsonPath("$.dailyRate", is(200.00)))
                .andExpect(jsonPath("$.hourlyRate", is(25.00)));

        SalaryRate saved = service.getByCode("CODE1");
        assertNotNull(saved);
        assertEquals("CODE1", saved.getCode());
        assertEquals("Academic Staff", saved.getName());
        assertEquals("Fortnight", saved.getPayrollType());
        assertEquals("Academic", saved.getCategory());
        assertEquals(0, saved.getFteRate().compareTo(new BigDecimal("100.00")));
        assertEquals(0, saved.getDailyRate().compareTo(new BigDecimal("200.00")));
        assertEquals(0, saved.getHourlyRate().compareTo(new BigDecimal("25.00")));
    }

    @Test
    void testDelete() throws Exception {
        SalaryRate rate = new SalaryRate();
        rate.setCode("CODE1");
        rate.setName("Academic Staff");
        rate.setPayrollType("Fortnight");
        rate.setCategory("Academic");
        rate.setFteRate(new BigDecimal("100.00"));
        rate.setDailyRate(new BigDecimal("200.00"));
        rate.setHourlyRate(new BigDecimal("25.00"));
        service.save(rate);

        mockMvc.perform(delete("/api/salary-rates/CODE1"))
                .andExpect(status().isOk());

        SalaryRate deleted = service.getByCode("CODE1");
        assertNull(deleted);
    }
}
