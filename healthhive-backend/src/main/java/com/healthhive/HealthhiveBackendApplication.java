package com.healthhive;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HealthhiveBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(HealthhiveBackendApplication.class, args);
	}

}
