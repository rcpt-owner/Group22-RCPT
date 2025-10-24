package com.itproject.rcpt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.itproject.rcpt.jpa.repositories")
@EnableMongoRepositories(basePackages = "com.itproject.rcpt.repository")

public class RcptApplication {

	public static void main(String[] args) {
        SpringApplication.run(RcptApplication.class, args);
    }

}
