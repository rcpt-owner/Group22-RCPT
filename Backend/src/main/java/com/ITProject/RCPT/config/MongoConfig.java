package com.itproject.rcpt.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@Configuration
@EnableMongoAuditing // enables @CreatedDate, @LastModifiedDate
public class MongoConfig { }
