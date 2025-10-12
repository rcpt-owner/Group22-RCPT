package com.ITProject.RCPT.Controllers.LookupControllers;

import com.ITProject.RCPT.JPA.Entities.SalaryRateMultiplier;
import com.ITProject.RCPT.JPA.Services.SalaryRateMultiplierService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SalaryRateMultiplierTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SalaryRateMultiplierService service;

    @Test
    void testGetAll() throws Exception {
        List<SalaryRateMultiplier> mockData = Arrays.asList(
                new SalaryRateMultiplier("hour", new BigDecimal("1.5")),
                new SalaryRateMultiplier("day", new BigDecimal("2.0"))
        );

        when(service.getAll()).thenReturn(mockData);

        mockMvc.perform(get("/api/salary-rate-multipliers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].unit", is("hour")))
                .andExpect(jsonPath("$[0].multiplier", is(1.5)));
    }

    @Test
    void testGetByUnit() throws Exception {
        SalaryRateMultiplier mockMultiplier = new SalaryRateMultiplier("hour", new BigDecimal("1.5"));
        when(service.getByUnit("hour")).thenReturn(mockMultiplier);

        mockMvc.perform(get("/api/salary-rate-multipliers/hour"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unit", is("hour")))
                .andExpect(jsonPath("$.multiplier", is(1.5)));
    }

    @Test
    void testCreateOrUpdate() throws Exception {
        SalaryRateMultiplier input = new SalaryRateMultiplier("week", new BigDecimal("3.0"));
        when(service.save(any(SalaryRateMultiplier.class))).thenReturn(input);

        mockMvc.perform(post("/api/salary-rate-multipliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"unit\": \"week\", \"multiplier\": 3.0}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unit", is("week")))
                .andExpect(jsonPath("$.multiplier", is(3.0)));
    }

    @Test
    void testDelete() throws Exception {
        doNothing().when(service).delete("hour");

        mockMvc.perform(delete("/api/salary-rate-multipliers/hour"))
                .andExpect(status().isOk());

        verify(service, times(1)).delete("hour");
    }
}
