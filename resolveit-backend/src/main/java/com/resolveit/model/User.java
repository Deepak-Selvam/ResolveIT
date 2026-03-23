package com.resolveit.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;          // bcrypt hashed

    private String firstName;
    private String lastName;
    private String phone;
    private String gender;
    private String dateOfBirth;
    private String address;
    private String locality;
    private String city;

    private Role role;                // CITIZEN, OFFICER, ADMIN
    private boolean verified = false;

    private String department;        // for OFFICER role
    private String employeeId;        // for OFFICER / ADMIN
    private boolean fullAccess = false; // allows seeing all complaints regardless of department

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role {
        CITIZEN, OFFICER, ADMIN
    }

    /** Convenience: full display name */
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
