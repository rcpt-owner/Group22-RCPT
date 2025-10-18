package com.itproject.rcpt.controllers.postgresLookupControllers;

import com.itproject.rcpt.jpa.entities.Stipend;
import com.itproject.rcpt.jpa.services.StipendService;
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
class StipendTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private StipendService service;

    @AfterEach
    void cleanup() {
        service.delete(2025);
        service.delete(2026);
    }

    @Test
    void testGetAll() throws Exception {
        Stipend s1 = new Stipend();
        s1.setYear(2025);
        s1.setRate(new BigDecimal("2500.50"));
        service.save(s1);

        Stipend s2 = new Stipend();
        s2.setYear(2026);
        s2.setRate(new BigDecimal("3000.75"));
        service.save(s2);

        mockMvc.perform(get("/api/stipends"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].year", is(2025)))
                .andExpect(jsonPath("$[1].year", is(2026)));
    }

    @Test
    void testGetByYear() throws Exception {
        Stipend stipend = new Stipend();
        stipend.setYear(2026);
        stipend.setRate(new BigDecimal("3000.75"));
        service.save(stipend);

        mockMvc.perform(get("/api/stipends/2026"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.year", is(2026)))
                .andExpect(jsonPath("$.rate", is(3000.75)));
    }

    @Test
    void testPost() throws Exception {
        String json = """
                {
                    "year": 2025,
                    "rate": 2500.50
                }
                """;

        mockMvc.perform(post("/api/stipends")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.year", is(2025)))
                .andExpect(jsonPath("$.rate", is(2500.50)));

        // Verify persistence
        Stipend saved = service.getByYear(2025);
        assertNotNull(saved);
        assertEquals(2025, saved.getYear());
        assertEquals(0, saved.getRate().compareTo(new BigDecimal("2500.50")));
    }

    @Test
    void testDelete() throws Exception {
        Stipend stipend = new Stipend();
        stipend.setYear(2025);
        stipend.setRate(new BigDecimal("2500.50"));
        service.save(stipend);

        mockMvc.perform(delete("/api/stipends/2025"))
                .andExpect(status().isOk());

        Stipend deleted = service.getByYear(2025);
        assertNull(deleted);
    }
}
