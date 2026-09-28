package com.shiwansh.user.config;

import com.shiwansh.user.model.User;
import com.shiwansh.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UserDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public UserDataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            userRepository.save(new User(
                    null,
                    "Admin QuickMart",
                    "admin@quickmart.com",
                    "admin123",
                    "ROLE_ADMIN",
                    "+91 9876543210",
                    "101 Tech Park, Bangalore, India"
            ));

            userRepository.save(new User(
                    null,
                    "John Doe",
                    "john.doe@gmail.com",
                    "user123",
                    "ROLE_CUSTOMER",
                    "+91 9123456780",
                    "42 MG Road, Pune, India"
            ));

            userRepository.save(new User(
                    null,
                    "Alice Smith",
                    "alice.smith@gmail.com",
                    "user123",
                    "ROLE_CUSTOMER",
                    "+91 9988776655",
                    "15 Park Avenue, Mumbai, India"
            ));
        }
    }
}
