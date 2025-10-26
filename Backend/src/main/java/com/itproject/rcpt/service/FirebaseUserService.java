package com.itproject.rcpt.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.itproject.rcpt.domain.User;
import com.itproject.rcpt.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class FirebaseUserService {

    private final UserRepository userRepository;

    public FirebaseUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Verifies a Firebase ID token, then finds or creates a local User record.
     * @param idToken The Firebase JWT token from the frontend
     * @return A synced User entity
     * @throws FirebaseAuthException If the token is invalid or expired
     */
    public User verifyAndSyncFirebaseUser(String idToken) throws FirebaseAuthException {
        // Step 1: Verify the Firebase token (this checks its signature & expiry)
        FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(idToken);

        String uid = decoded.getUid();
        String email = decoded.getEmail();
        String name = decoded.getName();

        // Step 2: Find existing user by Firebase UID
        User user = userRepository.findByFirebaseUid(uid).orElseGet(() -> {
            // Step 3: Create new user if not found
            User newUser = new User();
            newUser.setId(uid); // Use UID as Mongo _id
            newUser.setFirebaseUid(uid);
            newUser.setEmail(email);
            newUser.setDisplayName(name);
            newUser.addRole("USER");
            newUser.setActive(true);
            newUser.setCreatedAt(Instant.now());
            return newUser;
        });

        // Step 4: Update metadata
        user.setLastLoginAt(Instant.now());

        // Step 5: Save to Mongo
        return userRepository.save(user);
    }
}
