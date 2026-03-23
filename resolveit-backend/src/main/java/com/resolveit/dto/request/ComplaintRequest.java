package com.resolveit.dto.request;

import com.resolveit.model.Complaint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class ComplaintRequest {

    @Data
    public static class Create {
        @NotBlank
        private String title;

        @NotNull
        private Complaint.Category category;

        @NotBlank
        private String description;

        private String location;
        private String locality;
        private Double latitude;
        private Double longitude;
        private String imageUrl;
    }

    @Data
    public static class UpdateStatus {
        @NotNull
        private Complaint.Status status;

        private String note;
    }

    @Data
    public static class SubmitFeedback {
        @NotNull
        private Integer rating;    // 1–5

        private String feedback;
    }
}
