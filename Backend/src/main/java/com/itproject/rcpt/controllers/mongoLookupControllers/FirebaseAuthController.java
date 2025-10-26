package com.itproject.rcpt.controllers.mongoLookupControllers;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuthException;
import com.itproject.rcpt.domain.User;
import com.itproject.rcpt.service.FirebaseUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class FirebaseAuthController {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseAuthController.class);

    private final FirebaseUserService firebaseUserService;

    public FirebaseAuthController(FirebaseUserService firebaseUserService) {
        this.firebaseUserService = firebaseUserService;
    }

    @PostMapping("/firebase-login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            // Check Firebase initialization first
            if (FirebaseApp.getApps().isEmpty()) {
                String msg = "Firebase not initialized on server. Check service account configuration.";
                logger.warn(msg);
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("error", msg));
            }

            if (body == null || !body.containsKey("token") || body.get("token") == null || body.get("token").isBlank()) {
                String msg = "Missing 'token' in request body.";
                logger.info("Bad login attempt: {}", msg);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", msg));
            }

            String token = body.get("token");
            User user = firebaseUserService.verifyAndSyncFirebaseUser(token);
            return ResponseEntity.ok(user);
        } catch (FirebaseAuthException e) {
            logger.warn("Firebase authentication failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or expired Firebase token", "detail", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unhandled error during firebase-login", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Unexpected server error", "detail", e.getMessage()));
        }
    }
}