package com.resolveit.controller;

import com.resolveit.dto.request.ComplaintRequest;
import com.resolveit.dto.response.ApiResponse.*;
import com.resolveit.service.impl.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    // ════════════════════════════════════════════════════════════════════════
    //  CITIZEN
    // ════════════════════════════════════════════════════════════════════════

    /** POST /api/citizen/complaints — submit new complaint */
    @PostMapping("/citizen/complaints")
    public ResponseEntity<Success<ComplaintData>> submit(
            @AuthenticationPrincipal UserDetails ud,
            @Valid @RequestBody ComplaintRequest.Create req) {
        ComplaintData data = complaintService.submit(ud.getUsername(), req);
        return ResponseEntity.status(201).body(new Success<>("Complaint submitted", data));
    }

    /** GET /api/citizen/complaints — my complaints */
    @GetMapping("/citizen/complaints")
    public ResponseEntity<Success<List<ComplaintData>>> myComplaints(
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(new Success<>("Complaints fetched",
                complaintService.getMine(ud.getUsername())));
    }

    /** GET /api/citizen/complaints/{id} — single complaint detail */
    @GetMapping("/citizen/complaints/{id}")
    public ResponseEntity<Success<ComplaintData>> getOne(@PathVariable String id) {
        return ResponseEntity.ok(new Success<>("Complaint fetched", complaintService.getById(id)));
    }

    /** POST /api/citizen/complaints/{id}/feedback — submit rating + feedback */
    @PostMapping("/citizen/complaints/{id}/feedback")
    public ResponseEntity<Success<ComplaintData>> feedback(
            @PathVariable String id,
            @RequestBody ComplaintRequest.SubmitFeedback req) {
        return ResponseEntity.ok(new Success<>("Feedback submitted",
                complaintService.submitFeedback(id, req)));
    }

    /** GET /api/citizen/stats — citizen account stats */
    @GetMapping("/citizen/stats")
    public ResponseEntity<Success<CitizenStats>> citizenStats(
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(new Success<>("Stats fetched",
                complaintService.getCitizenStats(ud.getUsername())));
    }

    // ════════════════════════════════════════════════════════════════════════
    //  OFFICER
    // ════════════════════════════════════════════════════════════════════════

    /** GET /api/officer/complaints — all complaints (officer view) */
    @GetMapping("/officer/complaints")
    public ResponseEntity<Success<List<ComplaintData>>> officerAll(
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(new Success<>("Complaints fetched",
                complaintService.getAllForOfficer(ud.getUsername())));
    }

    /** GET /api/officer/complaints/assigned — officer's own assigned complaints */
    @GetMapping("/officer/complaints/assigned")
    public ResponseEntity<Success<List<ComplaintData>>> assigned(
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(new Success<>("Assigned complaints fetched",
                complaintService.getAssigned(ud.getUsername())));
    }

    /** PATCH /api/officer/complaints/{id}/status — update complaint status */
    @PatchMapping("/officer/complaints/{id}/status")
    public ResponseEntity<Success<ComplaintData>> updateStatus(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails ud,
            @RequestBody ComplaintRequest.UpdateStatus req) {
        return ResponseEntity.ok(new Success<>("Status updated",
                complaintService.updateStatus(id, ud.getUsername(), req)));
    }

    /** GET /api/officer/complaints/{id} — single complaint detail */
    @GetMapping("/officer/complaints/{id}")
    public ResponseEntity<Success<ComplaintData>> officerGetOne(@PathVariable String id) {
        return ResponseEntity.ok(new Success<>("Complaint fetched", complaintService.getById(id)));
    }

    // ════════════════════════════════════════════════════════════════════════
    //  ADMIN
    // ════════════════════════════════════════════════════════════════════════

    /** GET /api/admin/complaints — all complaints */
    @GetMapping("/admin/complaints")
    public ResponseEntity<Success<List<ComplaintData>>> adminAll() {
        return ResponseEntity.ok(new Success<>("All complaints fetched", complaintService.getAll()));
    }

    /** PATCH /api/admin/complaints/{id}/assign — assign officer */
    @PatchMapping("/admin/complaints/{id}/assign")
    public ResponseEntity<Success<ComplaintData>> assign(
            @PathVariable String id,
            @RequestParam String officerId) {
        return ResponseEntity.ok(new Success<>("Officer assigned",
                complaintService.assignOfficer(id, officerId)));
    }

    /** GET /api/admin/complaints/{id} — single complaint detail */
    @GetMapping("/admin/complaints/{id}")
    public ResponseEntity<Success<ComplaintData>> adminGetOne(@PathVariable String id) {
        return ResponseEntity.ok(new Success<>("Complaint fetched", complaintService.getById(id)));
    }

    /** PATCH /api/admin/complaints/{id}/status — admin can also update status */
    @PatchMapping("/admin/complaints/{id}/status")
    public ResponseEntity<Success<ComplaintData>> adminUpdateStatus(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails ud,
            @RequestBody ComplaintRequest.UpdateStatus req) {
        return ResponseEntity.ok(new Success<>("Status updated",
                complaintService.updateStatus(id, ud.getUsername(), req)));
    }

    // ════════════════════════════════════════════════════════════════════════
    //  PUBLIC / SHARED ANALYTICS
    // ════════════════════════════════════════════════════════════════════════

    /** GET /api/public/stats — landing page platform stats */
    @GetMapping("/public/stats")
    public ResponseEntity<Success<PlatformStats>> platformStats() {
        return ResponseEntity.ok(new Success<>("Stats fetched", complaintService.getPlatformStats()));
    }

    /** GET /api/officer/analytics/categories */
    @GetMapping("/officer/analytics/categories")
    public ResponseEntity<Success<List<CategoryCount>>> categoryStats(
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(new Success<>("Category stats",
                complaintService.getCategoryStats(ud.getUsername())));
    }

    /** GET /api/officer/analytics/localities */
    @GetMapping("/officer/analytics/localities")
    public ResponseEntity<Success<List<CategoryCount>>> localityStats(
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(new Success<>("Locality stats",
                complaintService.getLocalityStats(ud.getUsername())));
    }

    /** GET /api/officer/analytics/trend */
    @GetMapping("/officer/analytics/trend")
    public ResponseEntity<Success<List<TrendPoint>>> trend(
            @AuthenticationPrincipal UserDetails ud,
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(new Success<>("Trend data",
                complaintService.getTrend(ud.getUsername(), days)));
    }
}
