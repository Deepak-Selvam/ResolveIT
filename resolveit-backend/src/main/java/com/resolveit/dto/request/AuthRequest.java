package com.resolveit.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthRequest {

    @Data
    public static class Login {
        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String password;
    }

    @Data
    public static class Register {
        @NotBlank
        private String firstName;

        @NotBlank
        private String lastName;

        @NotBlank
        @Email
        private String email;

        @NotBlank
        @Size(min = 6)
        private String password;

        @NotBlank
        private String phone;

        private String city;
        private String locality;
        private String gender;
        private String dateOfBirth;

        // Default role is CITIZEN for self-registration
        // Officers / Admins are created by Admin only
    }

    @Data
    public static class ForgotPassword {
        @NotBlank
        @Email
        private String email;
    }

    @Data
    public static class ResetPassword {
        @NotBlank
        private String token;

        @NotBlank
        @Size(min = 6)
        private String newPassword;
    }

    @Data
    public static class CreateUser {
        @NotBlank
        private String firstName;
        @NotBlank
        private String lastName;
        @NotBlank
        @Email
        private String email;
        @NotBlank
        @Size(min = 6)
        private String password;
        private String role; // OFFICER, ADMIN
        private String department;
        private String phone;
        private boolean fullAccess;
    }
}
