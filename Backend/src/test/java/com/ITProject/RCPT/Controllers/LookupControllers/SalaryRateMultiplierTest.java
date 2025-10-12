package com.ITProject.RCPT.Controllers.LookupControllers;

import com.ITProject.RCPT.JPA.Entities.SalaryRateMultiplier;
import com.ITProject.RCPT.JPA.Services.SalaryRateMultiplierService;
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
import static org.hamcrest.number.IsCloseTo.closeTo;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SalaryRateMultiplierTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SalaryRateMultiplierService service;

    @AfterEach
    void cleanup() {
        service.delete("hour");
        service.delete("day");
        service.delete("week");
    }

    @Test
    void testGetAll() throws Exception {
        // Save test data
        service.save(new SalaryRateMultiplier("hour", new BigDecimal("1.5")));
        service.save(new SalaryRateMultiplier("day", new BigDecimal("2.0")));

        mockMvc.perform(get("/api/salary-rate-multipliers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].unit", is("hour")))
                .andExpect(jsonPath("$[0].multiplier", is(1.5)))
                .andExpect(jsonPath("$[1].unit", is("day")))
                .andExpect(jsonPath("$[1].multiplier", is(2.0)));
    }

    @Test
    void testGetByUnit() throws Exception {
        // Save test data
        service.save(new SalaryRateMultiplier("hour", new BigDecimal("1.5")));

        mockMvc.perform(get("/api/salary-rate-multipliers/hour"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unit", is("hour")))
                .andExpect(jsonPath("$.multiplier", is(1.5)));
    }

    @Test
    void testPost() throws Exception {
        String json = """
                {
                    "unit": "week",
                    "multiplier": 3.0
                }
                """;

        mockMvc.perform(post("/api/salary-rate-multipliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unit", is("week")))
                .andExpect(jsonPath("$.multiplier", closeTo(3.0, 0.000001)));

        // Verify the data persisted
        SalaryRateMultiplier saved = service.getByUnit("week");
        assertEquals(0, saved.getMultiplier().compareTo(new BigDecimal("3.0")));
    }

    @Test
    void testDelete() throws Exception {
        // Save test data
        service.save(new SalaryRateMultiplier("hour", new BigDecimal("1.5")));

        mockMvc.perform(delete("/api/salary-rate-multipliers/hour"))
                .andExpect(status().isOk());

        // Verify deletion
        SalaryRateMultiplier deleted = service.getByUnit("hour");
        assertNull(deleted);
    }
}
