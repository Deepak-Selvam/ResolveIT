package com.resolveit.controller;

import com.resolveit.dto.request.AuthRequest;
import com.resolveit.dto.response.ApiResponse.*;
import com.resolveit.service.impl.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** POST /api/auth/login */
    @PostMapping("/login")
    public ResponseEntity<Success<AuthData>> login(@Valid @RequestBody AuthRequest.Login req) {
        AuthData data = authService.login(req);
        return ResponseEntity.ok(new Success<>("Login successful", data));
    }

    /** POST /api/auth/register */
    @PostMapping("/register")
    public ResponseEntity<Success<AuthData>> register(@Valid @RequestBody AuthRequest.Register req) {
        AuthData data = authService.register(req);
        return ResponseEntity.status(201).body(new Success<>("Registration successful", data));
    }

    /** GET /api/auth/me — returns current user profile */
    @GetMapping("/me")
    public ResponseEntity<Success<UserProfile>> me(@AuthenticationPrincipal UserDetails userDetails) {
        UserProfile profile = authService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(new Success<>("Profile fetched", profile));
    }

    /** PUT /api/auth/me — update profile */
    @PutMapping("/me")
    public ResponseEntity<Success<UserProfile>> updateMe(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody AuthRequest.Register req) {
        UserProfile profile = authService.updateProfile(userDetails.getUsername(), req);
        return ResponseEntity.ok(new Success<>("Profile updated", profile));
    }

    /** POST /api/auth/forgot-password */
    @PostMapping("/forgot-password")
    public ResponseEntity<Success<Void>> forgotPassword(@Valid @RequestBody AuthRequest.ForgotPassword req) {
        authService.forgotPassword(req);
        return ResponseEntity.ok(new Success<>("Password reset email sent (if email exists)", null));
    }

    /** POST /api/auth/reset-password */
    @PostMapping("/reset-password")
    public ResponseEntity<Success<Void>> resetPassword(@Valid @RequestBody AuthRequest.ResetPassword req) {
        authService.resetPassword(req);
        return ResponseEntity.ok(new Success<>("Password successfully reset", null));
    }

    /** POST /api/auth/admin/create-user — admin creates OFFICER or ADMIN */
    @PostMapping("/admin/create-user")
    public ResponseEntity<Success<UserProfile>> adminCreateUser(@Valid @RequestBody AuthRequest.CreateUser req) {
        UserProfile profile = authService.createManagedUser(req);
        return ResponseEntity.status(201).body(new Success<>("User created successfully", profile));
    }

    /** GET /api/auth/admin/users — list users by role (admin only) */
    @GetMapping("/admin/users")
    public ResponseEntity<Success<java.util.List<UserProfile>>> listUsers(@RequestParam String role) {
        return ResponseEntity.ok(new Success<>("Users fetched", authService.listUsersByRole(role)));
    }
}
