package com.itproject.rcpt.controllers.postgresLookupControllers;

import com.itproject.rcpt.jpa.entities.User;
import com.itproject.rcpt.jpa.services.UserService;
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
class UserTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserService service;

    @AfterEach
    void cleanup() {
        service.delete("u001");
        service.delete("u002");
    }

    @Test
    void testGetAll() throws Exception {
        User u1 = new User();
        u1.setUserId("u001");
        u1.setName("Alice Smith");
        u1.setEmail("alice@example.com");
        u1.setIsAdmin(true);
        u1.setIsApprover(false);
        service.save(u1);

        User u2 = new User();
        u2.setUserId("u002");
        u2.setName("Bob Johnson");
        u2.setEmail("bob@example.com");
        u2.setIsAdmin(false);
        u2.setIsApprover(true);
        service.save(u2);

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].userId", is("u001")))
                .andExpect(jsonPath("$[1].userId", is("u002")));
    }

    @Test
    void testGetById() throws Exception {
        User user = new User();
        user.setUserId("u002");
        user.setName("Bob Johnson");
        user.setEmail("bob@example.com");
        user.setIsAdmin(false);
        user.setIsApprover(true);
        service.save(user);

        mockMvc.perform(get("/api/users/u002"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId", is("u002")))
                .andExpect(jsonPath("$.name", is("Bob Johnson")))
                .andExpect(jsonPath("$.email", is("bob@example.com")))
                .andExpect(jsonPath("$.isAdmin", is(false)))
                .andExpect(jsonPath("$.isApprover", is(true)));
    }

    @Test
    void testGetByEmail() throws Exception {
        User user = new User();
        user.setUserId("u002");
        user.setName("Bob Johnson");
        user.setEmail("bob@example.com");
        user.setIsAdmin(false);
        user.setIsApprover(true);
        service.save(user);

        mockMvc.perform(get("/api/users/email/bob@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId", is("u002")))
                .andExpect(jsonPath("$.name", is("Bob Johnson")))
                .andExpect(jsonPath("$.email", is("bob@example.com")))
                .andExpect(jsonPath("$.isAdmin", is(false)))
                .andExpect(jsonPath("$.isApprover", is(true)));
    }

    @Test
    void testPost() throws Exception {
        String json = """
                {
                    "userId": "u001",
                    "name": "Alice Smith",
                    "email": "alice@example.com",
                    "isAdmin": true,
                    "isApprover": false
                }
                """;

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId", is("u001")))
                .andExpect(jsonPath("$.name", is("Alice Smith")))
                .andExpect(jsonPath("$.email", is("alice@example.com")))
                .andExpect(jsonPath("$.isAdmin", is(true)))
                .andExpect(jsonPath("$.isApprover", is(false)));

        // Verify persistence
        User saved = service.getById("u001");
        assertNotNull(saved);
        assertEquals("u001", saved.getUserId());
        assertEquals("Alice Smith", saved.getName());
        assertEquals("alice@example.com", saved.getEmail());
        assertTrue(saved.getIsAdmin());
        assertFalse(saved.getIsApprover());
    }

    @Test
    void testDelete() throws Exception {
        User u1 = new User();
        u1.setUserId("u001");
        u1.setName("Alice Smith");
        u1.setEmail("alice@example.com");
        u1.setIsAdmin(true);
        u1.setIsApprover(false);
        service.save(u1);

        mockMvc.perform(delete("/api/users/u001"))
                .andExpect(status().isOk());

        User deleted = service.getById("u001");
        assertNull(deleted);
    }
}
