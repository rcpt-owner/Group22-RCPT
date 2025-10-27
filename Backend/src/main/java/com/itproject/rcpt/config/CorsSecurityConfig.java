package com.itproject.rcpt.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsSecurityConfig {

  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry reg) {
        reg.addMapping("/api/**")
           .allowedOrigins(
             "http://localhost:8080",
             "http://localhost:3000",
             "http://localhost:3001,",
             "https://group22-rcpt-backend.onrender.com",
             "https://group22-rcpt.onrender.com"
           )
           .allowedMethods("GET","POST","PATCH","PUT","DELETE","OPTIONS")
           .allowedHeaders("*")
           .allowCredentials(true)
           .maxAge(3600);
      }
    };
  }
}