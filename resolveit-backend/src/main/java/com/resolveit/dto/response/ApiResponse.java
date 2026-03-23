package com.resolveit.dto.response;

import com.resolveit.model.Complaint;
import com.resolveit.model.Notification;
import com.resolveit.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class ApiResponse {

    // ── Generic wrapper ────────────────────────────────────────────────────────
    @Data @AllArgsConstructor @NoArgsConstructor
    public static class Success<T> {
        private boolean success = true;
        private String  message;
        private T       data;

        public Success(String message, T data) {
            this.message = message;
            this.data    = data;
        }
    }

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class Error {
        private boolean success = false;
        private String  message;
        private int     status;
    }

    // ── Auth ──────────────────────────────────────────────────────────────────
    @Data @AllArgsConstructor @NoArgsConstructor
    public static class AuthData {
        private String      token;
        private UserProfile user;
    }

    // ── User Profile ──────────────────────────────────────────────────────────
    @Data @NoArgsConstructor
    public static class UserProfile {
        private String id;
        private String email;
        private String firstName;
        private String lastName;
        private String fullName;
        private String phone;
        private String gender;
        private String dateOfBirth;
        private String address;
        private String locality;
        private String city;
        private String role;
        private boolean verified;
        private String department;
        private boolean fullAccess;

        public static UserProfile from(User u) {
            UserProfile p = new UserProfile();
            p.id          = u.getId();
            p.email       = u.getEmail();
            p.firstName   = u.getFirstName();
            p.lastName    = u.getLastName();
            p.fullName    = u.getFullName();
            p.phone       = u.getPhone();
            p.gender      = u.getGender();
            p.dateOfBirth = u.getDateOfBirth();
            p.address     = u.getAddress();
            p.locality    = u.getLocality();
            p.city        = u.getCity();
            p.role        = u.getRole().name().toLowerCase();
            p.verified    = u.isVerified();
            p.department  = u.getDepartment();
            p.fullAccess  = u.isFullAccess();
            return p;
        }
    }

    // ── Complaint ─────────────────────────────────────────────────────────────
    @Data @NoArgsConstructor
    public static class ComplaintData {
        private String id;
        private String complaintNumber;
        private String citizenName;
        private String title;
        private String category;
        private String description;
        private String imageUrl;
        private String location;
        private Double latitude;
        private Double longitude;
        private String status;
        private String assignedOfficerId;
        private Integer rating;
        private String feedback;
        private List<Complaint.StatusLog> statusHistory;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static ComplaintData from(Complaint c) {
            ComplaintData d = new ComplaintData();
            d.id                = c.getId();
            d.complaintNumber   = c.getComplaintNumber();
            d.citizenName       = c.getCitizenName();
            d.title             = c.getTitle();
            d.category          = c.getCategory() != null ? c.getCategory().name() : null;
            d.description       = c.getDescription();
            d.imageUrl          = c.getImageUrl();
            d.location          = c.getLocation();
            d.latitude          = c.getLatitude();
            d.longitude         = c.getLongitude();
            d.status            = c.getStatus() != null ? c.getStatus().name() : "OPEN";
            d.assignedOfficerId = c.getAssignedOfficerId();
            d.rating            = c.getRating();
            d.feedback          = c.getFeedback();
            d.statusHistory     = c.getStatusHistory();
            d.createdAt         = c.getCreatedAt();
            d.updatedAt         = c.getUpdatedAt();
            return d;
        }
    }

    // ── Stats ─────────────────────────────────────────────────────────────────
    @Data @AllArgsConstructor @NoArgsConstructor
    public static class CitizenStats {
        private long totalRaised;
        private long resolved;
        private long inProgress;
        private long feedbackGiven;
    }

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class PlatformStats {
        private long totalComplaints;
        private long resolved;
        private long inProgress;
        private long open;
    }

    // ── Analytics ─────────────────────────────────────────────────────────────
    @Data @AllArgsConstructor @NoArgsConstructor
    public static class CategoryCount {
        private String name;
        private long   value;
    }

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class TrendPoint {
        private String date;
        private long   complaints;
    }

    // ── Notification ─────────────────────────────────────────────────────────
    @Data @NoArgsConstructor
    public static class NotificationData {
        private String  id;
        private String  title;
        private String  message;
        private String  icon;
        private boolean read;
        private String  complaintId;
        private LocalDateTime createdAt;

        public static NotificationData from(Notification n) {
            NotificationData d = new NotificationData();
            d.id          = n.getId();
            d.title       = n.getTitle();
            d.message     = n.getMessage();
            d.icon        = n.getIcon();
            d.read        = n.isRead();
            d.complaintId = n.getComplaintId();
            d.createdAt   = n.getCreatedAt();
            return d;
        }
    }
}
