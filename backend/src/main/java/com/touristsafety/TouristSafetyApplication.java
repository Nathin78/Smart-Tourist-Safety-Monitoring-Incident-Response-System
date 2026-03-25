package com.touristsafety;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.touristsafety")
public class TouristSafetyApplication {

    public static void main(String[] args) {
        SpringApplication.run(TouristSafetyApplication.class, args);
    }
}
