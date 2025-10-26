package com.itproject.rcpt.controllers.postgresLookupControllers;

import com.itproject.rcpt.jpa.entities.StaffBenefits;
import com.itproject.rcpt.jpa.services.StaffBenefitsService;
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
class StaffBenefitsTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private StaffBenefitsService service;

    @AfterEach
    void cleanup() {
        service.delete("Academic");
        service.delete("Professional");
    }

    @Test
    void testGetAll() throws Exception {
        StaffBenefits b1 = new StaffBenefits();
        b1.setStaffType("Academic");
        b1.setSuperannuation(new BigDecimal("0.09500"));
        b1.setLeaveLoading(new BigDecimal("0.17500"));
        b1.setWorkCover(new BigDecimal("0.01200"));
        b1.setParentalLeave(new BigDecimal("0.01800"));
        b1.setLongServiceLeave(new BigDecimal("0.02000"));
        b1.setAnnualLeave(new BigDecimal("0.08000"));
        service.save(b1);

        StaffBenefits b2 = new StaffBenefits();
        b2.setStaffType("Professional");
        b2.setSuperannuation(new BigDecimal("0.10000"));
        b2.setLeaveLoading(new BigDecimal("0.18000"));
        b2.setWorkCover(new BigDecimal("0.01500"));
        b2.setParentalLeave(new BigDecimal("0.02000"));
        b2.setLongServiceLeave(new BigDecimal("0.02500"));
        b2.setAnnualLeave(new BigDecimal("0.08500"));
        service.save(b2);

        mockMvc.perform(get("/api/staff-benefits"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].staffType", is("Academic")))
                .andExpect(jsonPath("$[1].staffType", is("Professional")));
    }

    @Test
    void testGetByStaffType() throws Exception {
        StaffBenefits benefits = new StaffBenefits();
        benefits.setStaffType("Professional");
        benefits.setSuperannuation(new BigDecimal("0.10000"));
        benefits.setLeaveLoading(new BigDecimal("0.18000"));
        benefits.setWorkCover(new BigDecimal("0.01500"));
        benefits.setParentalLeave(new BigDecimal("0.02000"));
        benefits.setLongServiceLeave(new BigDecimal("0.02500"));
        benefits.setAnnualLeave(new BigDecimal("0.08500"));
        service.save(benefits);

        mockMvc.perform(get("/api/staff-benefits/Professional"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.staffType", is("Professional")))
                .andExpect(jsonPath("$.superannuation", is(0.100)))
                .andExpect(jsonPath("$.leaveLoading", is(0.180)))
                .andExpect(jsonPath("$.workCover", is(0.015)))
                .andExpect(jsonPath("$.parentalLeave", is(0.020)))
                .andExpect(jsonPath("$.longServiceLeave", is(0.025)))
                .andExpect(jsonPath("$.annualLeave", is(0.085)));
    }

    @Test
    void testPost() throws Exception {
        String json = """
                {
                    "staffType": "Academic",
                    "superannuation": 0.09500,
                    "leaveLoading": 0.17500,
                    "workCover": 0.01200,
                    "parentalLeave": 0.01800,
                    "longServiceLeave": 0.02000,
                    "annualLeave": 0.08000
                }
                """;

        mockMvc.perform(post("/api/staff-benefits")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.staffType", is("Academic")))
                .andExpect(jsonPath("$.superannuation", is(0.095)))
                .andExpect(jsonPath("$.leaveLoading", is(0.175)))
                .andExpect(jsonPath("$.workCover", is(0.012)))
                .andExpect(jsonPath("$.parentalLeave", is(0.018)))
                .andExpect(jsonPath("$.longServiceLeave", is(0.020)))
                .andExpect(jsonPath("$.annualLeave", is(0.080)));

        // Verify persistence
        StaffBenefits saved = service.getByStaffType("Academic");
        assertNotNull(saved);
        assertEquals("Academic", saved.getStaffType());
        assertEquals(0, saved.getSuperannuation().compareTo(new BigDecimal("0.09500")));
        assertEquals(0, saved.getLeaveLoading().compareTo(new BigDecimal("0.17500")));
        assertEquals(0, saved.getWorkCover().compareTo(new BigDecimal("0.01200")));
        assertEquals(0, saved.getParentalLeave().compareTo(new BigDecimal("0.01800")));
        assertEquals(0, saved.getLongServiceLeave().compareTo(new BigDecimal("0.02000")));
        assertEquals(0, saved.getAnnualLeave().compareTo(new BigDecimal("0.08000")));
    }

    @Test
    void testDelete() throws Exception {
        StaffBenefits benefits = new StaffBenefits();
        benefits.setStaffType("Academic");
        benefits.setSuperannuation(new BigDecimal("0.09500"));
        benefits.setLeaveLoading(new BigDecimal("0.17500"));
        benefits.setWorkCover(new BigDecimal("0.01200"));
        benefits.setParentalLeave(new BigDecimal("0.01800"));
        benefits.setLongServiceLeave(new BigDecimal("0.02000"));
        benefits.setAnnualLeave(new BigDecimal("0.08000"));
        service.save(benefits);

        mockMvc.perform(delete("/api/staff-benefits/Academic"))
                .andExpect(status().isOk());

        StaffBenefits deleted = service.getByStaffType("Academic");
        assertNull(deleted);
    }
}
