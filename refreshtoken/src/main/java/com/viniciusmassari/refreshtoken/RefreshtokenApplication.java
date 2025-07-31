package com.viniciusmassari.refreshtoken;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@EnableMethodSecurity(securedEnabled = true)
@SpringBootApplication
public class RefreshtokenApplication {

    public static void main(String[] args) {
        SpringApplication.run(RefreshtokenApplication.class, args);
    }

}
