package com.resolveit.controller;

import com.resolveit.dto.response.ApiResponse.*;
import com.resolveit.service.impl.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notifService;

    /** GET /api/notifications */
    @GetMapping
    public ResponseEntity<Success<List<NotificationData>>> getAll(
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(new Success<>("Notifications fetched",
                notifService.getAll(ud.getUsername())));
    }

    /** GET /api/notifications/unread-count */
    @GetMapping("/unread-count")
    public ResponseEntity<Success<Long>> unreadCount(
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(new Success<>("Unread count",
                notifService.getUnreadCount(ud.getUsername())));
    }

    /** POST /api/notifications/mark-read */
    @PostMapping("/mark-read")
    public ResponseEntity<Success<Void>> markAllRead(
            @AuthenticationPrincipal UserDetails ud) {
        notifService.markAllRead(ud.getUsername());
        return ResponseEntity.ok(new Success<>("All marked as read", null));
    }
}
