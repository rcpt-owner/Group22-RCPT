package com.ITProject.RCPT.Controllers.LookupControllers;

import com.ITProject.RCPT.JPA.Entities.EBA;
import com.ITProject.RCPT.JPA.Services.EBAService;
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
class EBATest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EBAService service;

    @AfterEach
    void cleanup() {
        service.delete(2023);
        service.delete(2024);
    }

    @Test
    void testGetAll() throws Exception {
        EBA e1 = new EBA();
        e1.setYear(2023);
        e1.setEbaIncrease(new BigDecimal("1000.00"));
        e1.setEbaMultiplier(new BigDecimal("1.05"));
        service.save(e1);

        EBA e2 = new EBA();
        e2.setYear(2024);
        e2.setEbaIncrease(new BigDecimal("2000.00"));
        e2.setEbaMultiplier(new BigDecimal("1.10"));
        service.save(e2);

        mockMvc.perform(get("/api/eba"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].year", is(2023)))
                .andExpect(jsonPath("$[1].year", is(2024)));
    }

    @Test
    void testGetByYear() throws Exception {
        EBA eba = new EBA();
        eba.setYear(2024);
        eba.setEbaIncrease(new BigDecimal("2000.00"));
        eba.setEbaMultiplier(new BigDecimal("1.10"));
        service.save(eba);

        mockMvc.perform(get("/api/eba/2024"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.year", is(2024)))
                .andExpect(jsonPath("$.ebaIncrease", is(2000.00)))
                .andExpect(jsonPath("$.ebaMultiplier", is(1.10)));
    }

    @Test
    void testPost() throws Exception {
        String json = """
                {
                    "year": 2023,
                    "ebaIncrease": 1000.00,
                    "ebaMultiplier": 1.05
                }
                """;

        mockMvc.perform(post("/api/eba")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.year", is(2023)))
                .andExpect(jsonPath("$.ebaIncrease", is(1000.00)))
                .andExpect(jsonPath("$.ebaMultiplier", is(1.05)));

        // Verify persistence
        EBA saved = service.getByYear(2023);
        assertNotNull(saved);
        assertEquals(2023, saved.getYear());
        assertEquals(0, saved.getEbaIncrease().compareTo(new BigDecimal("1000.00")));
        assertEquals(0, saved.getEbaMultiplier().compareTo(new BigDecimal("1.05")));
    }

    @Test
    void testDelete() throws Exception {
        EBA eba = new EBA();
        eba.setYear(2023);
        eba.setEbaIncrease(new BigDecimal("1000.00"));
        eba.setEbaMultiplier(new BigDecimal("1.05"));
        service.save(eba);

        mockMvc.perform(delete("/api/eba/2023"))
                .andExpect(status().isOk());

        EBA deleted = service.getByYear(2023);
        assertNull(deleted);
    }
}
