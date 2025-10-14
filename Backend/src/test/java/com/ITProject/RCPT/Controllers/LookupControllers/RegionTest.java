package com.ITProject.RCPT.Controllers.LookupControllers;

import com.ITProject.RCPT.JPA.Entities.Region;
import com.ITProject.RCPT.JPA.Services.RegionService;
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
@ActiveProfiles("test") // H2 in-memory database
class RegionTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RegionService service;

    @AfterEach
    void cleanup() {
        service.delete("Northland");
        service.delete("Southbank");
    }

    @Test
    void testGetAll() throws Exception {
        Region r1 = new Region();
        r1.setName("Northland");
        r1.setRegionCode("NR001");
        service.create(r1);

        Region r2 = new Region();
        r2.setName("Southbank");
        r2.setRegionCode("SR001");
        service.create(r2);

        mockMvc.perform(get("/api/regions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Northland")))
                .andExpect(jsonPath("$[1].name", is("Southbank")));
    }

    @Test
    void testGetRegionByName() throws Exception {
        Region region = new Region();
        region.setName("Southbank");
        region.setRegionCode("SR001");
        service.create(region);

        mockMvc.perform(get("/api/regions/Southbank"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Southbank")))
                .andExpect(jsonPath("$.regionCode", is("SR001")));
    }

    @Test
    void testPost() throws Exception {
        String json = """
                {
                    "name": "Northland",
                    "regionCode": "NR001"
                }
                """;

        mockMvc.perform(post("/api/regions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Northland")))
                .andExpect(jsonPath("$.regionCode", is("NR001")));

        // Verify persistence
        Region saved = service.getByName("Northland");
        assertNotNull(saved);
        assertEquals("Northland", saved.getName());
        assertEquals("NR001", saved.getRegionCode());
    }

    @Test
    void testDelete() throws Exception {
        Region region = new Region();
        region.setName("Northland");
        region.setRegionCode("NR001");
        service.create(region);

        mockMvc.perform(delete("/api/regions/Northland"))
                .andExpect(status().isOk());

        Region deleted = service.getByName("Northland");
        assertNull(deleted);
    }
}
