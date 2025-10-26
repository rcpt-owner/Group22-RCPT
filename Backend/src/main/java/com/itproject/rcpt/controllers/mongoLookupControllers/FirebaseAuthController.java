package com.itproject.rcpt.controllers;

import com.google.firebase.auth.FirebaseAuthException;
import com.itproject.rcpt.domain.User;
import com.itproject.rcpt.service.FirebaseUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class FirebaseAuthController {

    private final FirebaseUserService firebaseUserService;

    public FirebaseAuthController(FirebaseUserService firebaseUserService) {
        this.firebaseUserService = firebaseUserService;
    }

    @PostMapping("/firebase-login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String token = body.get("token");
            User user = firebaseUserService.verifyAndSyncFirebaseUser(token);
            return ResponseEntity.ok(user);
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}
