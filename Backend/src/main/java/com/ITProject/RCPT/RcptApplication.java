package com.ITProject.RCPT;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("com.ITProject.RCPT.Repositories")
@EntityScan("com.ITProject.RCPT.Entities")
public class RcptApplication {

	public static void main(String[] args) {
		SpringApplication.run(RcptApplication.class, args);
	}

}
