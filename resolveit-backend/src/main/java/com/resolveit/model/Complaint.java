package com.resolveit.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "complaints")
public class Complaint {

    @Id
    private String id;

    private String complaintNumber; // e.g. "#10234"

    @Indexed
    private String citizenId; // User.id of the submitter
    private String citizenName; // denormalized for fast queries

    private String title;
    private Category category;
    private String description;
    private String imageUrl;

    private String location; // free-text address
    private String locality; // area/locality for aggregation
    private Double latitude;
    private Double longitude;

    @Indexed
    private String departmentId; // assigned department
    private String assignedOfficerId; // officer handling it

    @Indexed
    private Status status = Status.OPEN;

    private List<StatusLog> statusHistory = new ArrayList<>();

    private Integer rating; // 1–5, set after resolution
    private String feedback;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    // ── Enums ─────────────────────────────────────────────────────────────────

    public enum Status {
        OPEN, UNDER_REVIEW, IN_PROGRESS, RESOLVED, CLOSED;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static Status fromString(String value) {
            if (value == null) return OPEN;
            String normalized = value.toUpperCase().trim().replace(" ", "_");
            try {
                return Status.valueOf(normalized);
            } catch (IllegalArgumentException e) {
                return OPEN;
            }
        }

        @com.fasterxml.jackson.annotation.JsonValue
        public String toValue() {
            return name();
        }
    }

    public enum Category {
        ROAD_DAMAGE,
        GARBAGE,
        WATER_LEAKAGE,
        STREETLIGHT,
        DRAINAGE,
        PUBLIC_SAFETY;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static Category fromString(String value) {
            if (value == null)
                return ROAD_DAMAGE;
            String normalized = value.toUpperCase().trim().replace(" ", "_");

            // Handle common aliases or legacy data
            if (normalized.equals("ROADS") || normalized.equals("ROAD"))
                return ROAD_DAMAGE;
            if (normalized.equals("GARBAGE_ACCUMULATION"))
                return GARBAGE;
            if (normalized.equals("WATER"))
                return WATER_LEAKAGE;
            if (normalized.equals("LIGHTS") || normalized.equals("STREET_LIGHT"))
                return STREETLIGHT;

            try {
                return Category.valueOf(normalized);
            } catch (IllegalArgumentException e) {
                return ROAD_DAMAGE; // Fallback to a default instead of crashing
            }
        }

        @com.fasterxml.jackson.annotation.JsonValue
        public String toValue() {
            return name();
        }
    }

    // ── Embedded status log ────────────────────────────────────────────────────

    @Data
    @NoArgsConstructor
    public static class StatusLog {
        private Status status;
        private String updatedBy; // officer/admin name
        private String note;
        private LocalDateTime timestamp = LocalDateTime.now();

        public StatusLog(Status status, String updatedBy, String note) {
            this.status = status;
            this.updatedBy = updatedBy;
            this.note = note;
        }
    }
}
