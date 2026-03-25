package com.touristsafety.config;

import com.touristsafety.entity.Tourist;
import com.touristsafety.entity.Role;
import com.touristsafety.repository.TouristRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

@Configuration
public class DataInitializer {

    private static final String ADMIN_EMAIL = "admin@touristsafety.com";
    private static final String ADMIN_PASS = "admin123";

    @Bean
    CommandLineRunner initDatabase(TouristRepository touristRepository, BCryptPasswordEncoder passwordEncoder) {
        return args -> {
            Optional<Tourist> adminOpt = touristRepository.findByEmail(ADMIN_EMAIL);
            if (adminOpt.isEmpty()) {
                Tourist admin = new Tourist();
                admin.setName("Admin User");
                admin.setPassportNumber("ADMIN001");
                admin.setCountry("USA");
                admin.setPhone("+1234567890");
                admin.setEmail(ADMIN_EMAIL);
                admin.setPassword(passwordEncoder.encode(ADMIN_PASS));
                admin.setIsActive(true);
                admin.setRole(Role.ADMIN);
                touristRepository.save(admin);
                System.out.println("Created default admin user");
                return;
            }

            Tourist admin = adminOpt.get();
            if (admin.getRole() != Role.ADMIN) {
                admin.setRole(Role.ADMIN);
                touristRepository.save(admin);
                System.out.println("Updated default admin role");
            }
            String storedPassword = admin.getPassword();
            boolean looksLikeBcrypt = storedPassword != null &&
                    (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$"));

            if (!looksLikeBcrypt) {
                admin.setPassword(passwordEncoder.encode(ADMIN_PASS));
                touristRepository.save(admin);
                System.out.println("Updated default admin password hash");
                return;
            }

            if (!passwordEncoder.matches(ADMIN_PASS, storedPassword)) {
                admin.setPassword(passwordEncoder.encode(ADMIN_PASS));
                touristRepository.save(admin);
                System.out.println("Reset default admin password");
            }
        };
    }
}
