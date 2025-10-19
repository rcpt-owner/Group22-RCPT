package com.itproject.rcpt.controllers.postgresLookupControllers;

import com.itproject.rcpt.jpa.entities.NonStaffCosts;
import com.itproject.rcpt.jpa.services.NonStaffCostsService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class NonStaffCostsTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private NonStaffCostsService service;

    @AfterEach
    void cleanup() {
        service.delete("Travel");
        service.delete("Catering");
    }

    @Test
    void testGetAll() throws Exception {
        NonStaffCosts c1 = new NonStaffCosts();
        c1.setCostSubcategory("Travel");
        c1.setCostCategory("Operations");
        service.save(c1);

        NonStaffCosts c2 = new NonStaffCosts();
        c2.setCostSubcategory("Catering");
        c2.setCostCategory("Events");
        service.save(c2);

        mockMvc.perform(get("/api/non-staff-costs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].costSubcategory", is("Travel")))
                .andExpect(jsonPath("$[0].costCategory", is("Operations")))
                .andExpect(jsonPath("$[1].costSubcategory", is("Catering")))
                .andExpect(jsonPath("$[1].costCategory", is("Events")));
    }

    @Test
    void testGetBySubcategory() throws Exception {
        NonStaffCosts cost = new NonStaffCosts();
        cost.setCostSubcategory("Travel");
        cost.setCostCategory("Operations");
        service.save(cost);

        mockMvc.perform(get("/api/non-staff-costs/Travel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.costSubcategory", is("Travel")))
                .andExpect(jsonPath("$.costCategory", is("Operations")));
    }

    @Test
    void testPost() throws Exception {
        String json = """
                {
                    "costSubcategory": "Travel",
                    "costCategory": "Operations"
                }
                """;

        mockMvc.perform(post("/api/non-staff-costs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.costSubcategory", is("Travel")))
                .andExpect(jsonPath("$.costCategory", is("Operations")));

        // Verify persistence
        NonStaffCosts saved = service.getBySubcategory("Travel");
        assertNotNull(saved);
        assertEquals("Travel", saved.getCostSubcategory());
        assertEquals("Operations", saved.getCostCategory());
    }

    @Test
    void testDelete() throws Exception {
        NonStaffCosts cost = new NonStaffCosts();
        cost.setCostSubcategory("Travel");
        cost.setCostCategory("Operations");
        service.save(cost);

        mockMvc.perform(delete("/api/non-staff-costs/Travel"))
                .andExpect(status().isOk());

        NonStaffCosts deleted = service.getBySubcategory("Travel");
        assertNull(deleted);
    }
}
