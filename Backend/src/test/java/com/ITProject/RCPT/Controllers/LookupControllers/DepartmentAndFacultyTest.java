package com.ITProject.RCPT.Controllers.LookupControllers;

import com.ITProject.RCPT.JPA.Entities.DepartmentAndFaculty;
import com.ITProject.RCPT.JPA.Services.DepartmentAndFacultyService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;


import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DepartmentAndFacultyTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DepartmentAndFacultyService service; // real service

    @AfterEach
    void cleanup() {
        // Cleanup any test data
        service.delete("Arts");
        service.delete("Engineering");
        service.delete("Science");
    }

    @Test
    void testGetAll() throws Exception {
        // Save multiple departments
        DepartmentAndFaculty d1 = new DepartmentAndFaculty();
        d1.setDepartment("Arts");
        d1.setDeptCode("ART001");
        d1.setSchool("School of Arts");
        d1.setSchoolCode("SCHART");
        d1.setFacultyCode("FACART");
        d1.setFaculty("Faculty of Arts");
        service.create(d1);

        DepartmentAndFaculty d2 = new DepartmentAndFaculty();
        d2.setDepartment("Engineering");
        d2.setDeptCode("ENG001");
        d2.setSchool("School of Engineering");
        d2.setSchoolCode("SCHENG");
        d2.setFacultyCode("FACENG");
        d2.setFaculty("Faculty of Engineering");
        service.create(d2);

        // GET list of department names
        mockMvc.perform(get("/api/departments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]", is("Arts")))
                .andExpect(jsonPath("$[1]", is("Engineering")));
    }

    @Test
    void testGetByDepartment() throws Exception {
        // Save test data directly
        DepartmentAndFaculty dept = new DepartmentAndFaculty();
        dept.setDepartment("Engineering");
        dept.setDeptCode("ENG001");
        dept.setSchool("School of Engineering");
        dept.setSchoolCode("SCHENG");
        dept.setFacultyCode("FACENG");
        dept.setFaculty("Faculty of Engineering");
        service.create(dept);

        // GET request
        mockMvc.perform(get("/api/departments/Engineering"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.department", is("Engineering")))
                .andExpect(jsonPath("$.deptCode", is("ENG001")))
                .andExpect(jsonPath("$.school", is("School of Engineering")))
                .andExpect(jsonPath("$.schoolCode", is("SCHENG")))
                .andExpect(jsonPath("$.facultyCode", is("FACENG")))
                .andExpect(jsonPath("$.faculty", is("Faculty of Engineering")));
    }

    @Test
    void testPost() throws Exception {
        String json = """
                {
                    "department": "Arts",
                    "deptCode": "ART001",
                    "school": "School of Arts",
                    "schoolCode": "SCHART",
                    "facultyCode": "FACART",
                    "faculty": "Faculty of Arts"
                }
                """;

        // Perform POST request
        mockMvc.perform(post("/api/departments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.department", is("Arts")))
                .andExpect(jsonPath("$.deptCode", is("ART001")))
                .andExpect(jsonPath("$.school", is("School of Arts")))
                .andExpect(jsonPath("$.schoolCode", is("SCHART")))
                .andExpect(jsonPath("$.facultyCode", is("FACART")))
                .andExpect(jsonPath("$.faculty", is("Faculty of Arts")));

        // Verify data persisted
        DepartmentAndFaculty saved = service.getByDepartment("Arts");
        assertNotNull(saved);
        assertEquals("ART001", saved.getDeptCode());
        assertEquals("School of Arts", saved.getSchool());
        assertEquals("SCHART", saved.getSchoolCode());
        assertEquals("FACART", saved.getFacultyCode());
        assertEquals("Faculty of Arts", saved.getFaculty());
    }

    @Test
    void testDelete() throws Exception {
        // Save test data
        DepartmentAndFaculty dept = new DepartmentAndFaculty();
        dept.setDepartment("Science");
        dept.setDeptCode("SCI001");
        dept.setSchool("School of Science");
        dept.setSchoolCode("SCHSCI");
        dept.setFacultyCode("FACSCI");
        dept.setFaculty("Faculty of Science");
        service.create(dept);

        // Delete via API
        mockMvc.perform(delete("/api/departments/Science"))
                .andExpect(status().isOk());

        // Verify deletion
        DepartmentAndFaculty deleted = service.getByDepartment("Science");
        assertNull(deleted);
    }
}
