package com.resolveit.config;

import com.resolveit.model.User;
import com.resolveit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("============== SYSTEM INITIALIZATION ==============");
        log.info("Checking for default system accounts...");

        // 1. Create/Update Admin
        Optional<User> adminOpt = userRepository.findByEmail("admin@resolveit.com");
        User admin = adminOpt.orElse(new User());
        admin.setFirstName("Super");
        admin.setLastName("Admin");
        admin.setEmail("admin@resolveit.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(User.Role.ADMIN);
        admin.setVerified(true);
        userRepository.save(admin);
        log.info(adminOpt.isEmpty() ? "[✓] Created Default Admin" : "[i] Admin account updated (Password: admin123)");

        // 2. Create/Update Officer
        Optional<User> officerOpt = userRepository.findByEmail("officer@resolveit.com");
        User officer = officerOpt.orElse(new User());
        officer.setFirstName("Official");
        officer.setLastName("Officer");
        officer.setEmail("officer@resolveit.com");
        officer.setPassword(passwordEncoder.encode("officer123"));
        officer.setRole(User.Role.OFFICER);
        officer.setDepartment("Public Works");
        officer.setVerified(true);
        userRepository.save(officer);
        log.info(officerOpt.isEmpty() ? "[✓] Created Default Officer" : "[i] Officer account updated");

        // 3. Create/Update Citizen
        Optional<User> citizenOpt = userRepository.findByEmail("citizen@resolveit.com");
        User citizen = citizenOpt.orElse(new User());
        citizen.setFirstName("John");
        citizen.setLastName("Citizen");
        citizen.setEmail("citizen@resolveit.com");
        citizen.setPassword(passwordEncoder.encode("citizen123"));
        citizen.setRole(User.Role.CITIZEN);
        citizen.setVerified(true);
        userRepository.save(citizen);
        log.info(citizenOpt.isEmpty() ? "[✓] Created Default Citizen" : "[i] Citizen account updated");

        log.info("====================================================");
    }
}
