package com.resolveit.service.impl;

import com.resolveit.dto.request.AuthRequest;
import com.resolveit.dto.response.ApiResponse.*;
import com.resolveit.model.PasswordResetToken;
import com.resolveit.model.User;
import com.resolveit.repository.PasswordResetTokenRepository;
import com.resolveit.repository.UserRepository;
import com.resolveit.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authManager;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    public void forgotPassword(AuthRequest.ForgotPassword req) {
        java.util.Optional<User> userOpt = userRepository.findByEmail(req.getEmail());
        
        if (userOpt.isEmpty()) {
            // Log for internal tracking but don't leak info to user
            System.out.println("Forgot password requested for non-existent email: " + req.getEmail());
            return;
        }

        User user = userOpt.get();

        // Generate a simple UUID token
        String token = java.util.UUID.randomUUID().toString();

        // Clean up old tokens for this email
        tokenRepository.deleteByEmail(user.getEmail());

        // Save new token (expires in 1 hour)
        PasswordResetToken resetToken = new PasswordResetToken(user.getEmail(), token, 1);
        tokenRepository.save(resetToken);

        // Send email
        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    public void resetPassword(AuthRequest.ResetPassword req) {
        PasswordResetToken resetToken = tokenRepository.findByToken(req.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired token"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new IllegalArgumentException("Token has expired");
        }

        User user = userRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        // Delete the used token
        tokenRepository.delete(resetToken);
    }

    public AuthData login(AuthRequest.Login req) {
        // Authenticate via Spring Security (throws on bad credentials)
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();
        String jwt = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        return new AuthData(jwt, UserProfile.from(user));
    }

    public AuthData register(AuthRequest.Register req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setPhone(req.getPhone());
        user.setCity(req.getCity());
        user.setLocality(req.getLocality());
        user.setGender(req.getGender());
        user.setDateOfBirth(req.getDateOfBirth());
        user.setRole(User.Role.CITIZEN);
        user.setVerified(false);

        userRepository.save(user);

        // Send welcome email
        emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());

        String jwt = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        return new AuthData(jwt, UserProfile.from(user));
    }

    public UserProfile getProfile(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return UserProfile.from(user);
    }

    public UserProfile updateProfile(String email, AuthRequest.Register req) {
        User user = userRepository.findByEmail(email).orElseThrow();
        if (req.getFirstName() != null)
            user.setFirstName(req.getFirstName());
        if (req.getLastName() != null)
            user.setLastName(req.getLastName());
        if (req.getPhone() != null)
            user.setPhone(req.getPhone());
        if (req.getCity() != null)
            user.setCity(req.getCity());
        if (req.getLocality() != null)
            user.setLocality(req.getLocality());
        if (req.getGender() != null)
            user.setGender(req.getGender());
        if (req.getDateOfBirth() != null)
            user.setDateOfBirth(req.getDateOfBirth());
        userRepository.save(user);
        return UserProfile.from(user);
    }

    public UserProfile createManagedUser(AuthRequest.CreateUser req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(User.Role.valueOf(req.getRole().toUpperCase()));
        user.setDepartment(req.getDepartment());
        user.setPhone(req.getPhone());
        user.setFullAccess(req.isFullAccess());
        user.setVerified(true); // Admin-created accounts are verified by default

        userRepository.save(user);
        return UserProfile.from(user);
    }

    public java.util.List<UserProfile> listUsersByRole(String role) {
        return userRepository.findByRole(User.Role.valueOf(role.toUpperCase()))
                .stream()
                .map(UserProfile::from)
                .collect(java.util.stream.Collectors.toList());
    }

    public void deleteUser(String userId, String adminEmail) {
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new IllegalStateException("Admin not found"));

        if (targetUser.getEmail().equals(admin.getEmail())) {
            throw new IllegalArgumentException("Admins cannot delete themselves");
        }

        // Optional: Pre-check or cleanup logic here (e.g., reassigning complaints)
        // For now, we just perform a hard delete as requested.
        userRepository.delete(targetUser);
    }
}
