package com.resolveit.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    @Indexed
    private String userId;       // recipient

    private String title;
    private String message;
    private String icon;         // emoji

    private boolean read = false;

    private String complaintId;  // optional link

    private LocalDateTime createdAt = LocalDateTime.now();

    public Notification(String userId, String title, String message, String icon, String complaintId) {
        this.userId      = userId;
        this.title       = title;
        this.message     = message;
        this.icon        = icon;
        this.complaintId = complaintId;
    }
}
