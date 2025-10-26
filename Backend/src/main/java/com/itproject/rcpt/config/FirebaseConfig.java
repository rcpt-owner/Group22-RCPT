package com.itproject.rcpt.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import jakarta.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Firebase initialization helper.
 *
 * Runtime expectations:
 * - Prefer injecting the raw service account JSON via the FIREBASE_SERVICE_ACCOUNT env var
 *   (e.g. from secret manager or orchestrator secrets).
 * - Alternatively set GOOGLE_APPLICATION_CREDENTIALS to a path inside the container.
 * - As a last resort, the application can load a classpath resource specified by
 *   firebase.credentials.path (e.g. classpath:firebase-service-account.json).
 */
@Configuration
public class FirebaseConfig {

	private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

	private final Environment env;

	public FirebaseConfig(Environment env) {
		this.env = env;
	}

	@PostConstruct
	public void init() {
		if (!FirebaseApp.getApps().isEmpty()) {
			logger.info("FirebaseApp already initialized; skipping Firebase setup.");
			return;
		}

		// 1) Try raw JSON from FIREBASE_SERVICE_ACCOUNT environment variable
		String saJson = System.getenv("FIREBASE_SERVICE_ACCOUNT");
		if (saJson != null && !saJson.isBlank()) {
			// Trim wrapping single or double quotes that may be present when injected via some tools
			saJson = saJson.trim();
			if ((saJson.startsWith("'") && saJson.endsWith("'")) || (saJson.startsWith("\"") && saJson.endsWith("\""))) {
				saJson = saJson.substring(1, saJson.length() - 1);
			}
			try (InputStream is = new ByteArrayInputStream(saJson.getBytes(StandardCharsets.UTF_8))) {
				GoogleCredentials credentials = GoogleCredentials.fromStream(is);
				FirebaseOptions options = FirebaseOptions.builder()
						.setCredentials(credentials)
						.build();
				FirebaseApp.initializeApp(options);
				logger.info("Initialized FirebaseApp from FIREBASE_SERVICE_ACCOUNT environment variable.");
				return;
			} catch (IOException e) {
				logger.error("Failed to initialize Firebase from FIREBASE_SERVICE_ACCOUNT environment variable.", e);
			}
		} else {
			logger.debug("FIREBASE_SERVICE_ACCOUNT environment variable not set or empty.");
		}

		// // 2) Fall back to GOOGLE_APPLICATION_CREDENTIALS file path, if set and readable
		// String gacPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
		// if (gacPath != null && !gacPath.isBlank()) {
		// 	Path path = Paths.get(gacPath);
		// 	if (Files.exists(path) && Files.isReadable(path)) {
		// 		try (InputStream is = Files.newInputStream(path)) {
		// 			GoogleCredentials credentials = GoogleCredentials.fromStream(is);
		// 			FirebaseOptions options = FirebaseOptions.builder()
		// 					.setCredentials(credentials)
		// 					.build();
		// 			FirebaseApp.initializeApp(options);
		// 			logger.info("Initialized FirebaseApp from GOOGLE_APPLICATION_CREDENTIALS file: {}", gacPath);
		// 			return;
		// 		} catch (IOException e) {
		// 			logger.error("Failed to initialize Firebase from GOOGLE_APPLICATION_CREDENTIALS file: {}", gacPath, e);
		// 		}
		// 	} else {
		// 		logger.warn("GOOGLE_APPLICATION_CREDENTIALS is set but file does not exist or is not readable: {}", gacPath);
		// 	}
		// } else {
		// 	logger.debug("GOOGLE_APPLICATION_CREDENTIALS environment variable not set.");
		// }



		// No credentials available; do not abort startup
		logger.warn("No Firebase credentials found. FirebaseApp not initialized. " +
				"Provide FIREBASE_SERVICE_ACCOUNT (raw JSON), set GOOGLE_APPLICATION_CREDENTIALS to a valid file, " +
				"or configure firebase.credentials.path to a classpath/file resource. Prefer using orchestrator secret mechanisms or cloud IAM (ADC) in production.");
	}
}