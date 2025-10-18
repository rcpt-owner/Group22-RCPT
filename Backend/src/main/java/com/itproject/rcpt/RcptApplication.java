package com.itproject.rcpt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJparepository;

@SpringBootApplication
@EnableJparepository("com.itproject.rcpt.jpa.repository")
@EntityScan("com.itproject.rcpt.jpa.entities")
public class RcptApplication {

	public static void main(String[] args) {
		SpringApplication.run(RcptApplication.class, args);
	}

}
