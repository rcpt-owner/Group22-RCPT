package com.itproject.rcpt.controllers.postgresLookupControllers;

import com.itproject.rcpt.jpa.entities.PayrollTax;
import com.itproject.rcpt.jpa.services.PayrollTaxService;
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
class PayrollTaxTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PayrollTaxService service;

    @AfterEach
    void cleanup() {
        service.delete(2023);
        service.delete(2024);
    }

    @Test
    void testCreateOrUpdatePersistsData() throws Exception {
        String json = """
                {
                    "year": 2023,
                    "rate": 0.3250
                }
                """;

        mockMvc.perform(post("/api/payroll-tax")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.year", is(2023)))
                .andExpect(jsonPath("$.rate", is(0.3250)));

        PayrollTax saved = service.getByYear(2023);
        assertNotNull(saved);
        assertEquals(2023, saved.getYear());
        assertEquals(0, saved.getRate().compareTo(new BigDecimal("0.3250")));
    }

    @Test
    void testGetByYearPersistsData() throws Exception {
        PayrollTax tax = new PayrollTax();
        tax.setYear(2024);
        tax.setRate(new BigDecimal("0.3500"));
        service.save(tax);

        mockMvc.perform(get("/api/payroll-tax/2024"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.year", is(2024)))
                .andExpect(jsonPath("$.rate", is(0.3500)));
    }

    @Test
    void testGetAllPersistsData() throws Exception {
        PayrollTax t1 = new PayrollTax();
        t1.setYear(2023);
        t1.setRate(new BigDecimal("0.3250"));
        service.save(t1);

        PayrollTax t2 = new PayrollTax();
        t2.setYear(2024);
        t2.setRate(new BigDecimal("0.3500"));
        service.save(t2);

        mockMvc.perform(get("/api/payroll-tax"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].year", is(2023)))
                .andExpect(jsonPath("$[1].year", is(2024)));
    }

    @Test
    void testDeletePersistsData() throws Exception {
        PayrollTax tax = new PayrollTax();
        tax.setYear(2023);
        tax.setRate(new BigDecimal("0.3250"));
        service.save(tax);

        mockMvc.perform(delete("/api/payroll-tax/2023"))
                .andExpect(status().isOk());

        PayrollTax deleted = service.getByYear(2023);
        assertNull(deleted);
    }
}
