package com.resolveit.service.impl;

import com.resolveit.dto.request.ComplaintRequest;
import com.resolveit.dto.response.ApiResponse.*;
import com.resolveit.model.Complaint;
import com.resolveit.model.Notification;
import com.resolveit.model.User;
import com.resolveit.repository.ComplaintRepository;
import com.resolveit.repository.NotificationRepository;
import com.resolveit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComplaintService {

    private final ComplaintRepository complaintRepo;
    private final UserRepository userRepo;
    private final NotificationRepository notifRepo;
    private final EmailService emailService;

    // ── Citizen: submit complaint ─────────────────────────────────────────────
    public ComplaintData submit(String citizenEmail, ComplaintRequest.Create req) {
        User citizen = userRepo.findByEmail(citizenEmail).orElseThrow();

        Complaint c = new Complaint();
        c.setComplaintNumber(generateNumber());
        c.setCitizenId(citizen.getId());
        c.setCitizenName(citizen.getFullName());
        c.setTitle(req.getTitle());
        c.setCategory(req.getCategory());
        c.setDescription(req.getDescription());
        c.setLocation(req.getLocation());
        c.setLocality(req.getLocality() != null ? req.getLocality() : citizen.getLocality());
        c.setLatitude(req.getLatitude());
        c.setLongitude(req.getLongitude());
        c.setImageUrl(req.getImageUrl());
        c.setStatus(Complaint.Status.OPEN);
        c.getStatusHistory().add(
                new Complaint.StatusLog(Complaint.Status.OPEN, citizen.getFullName(), "Complaint submitted"));

        complaintRepo.save(c);

        // Notify citizen
        notifRepo.save(new Notification(
                citizen.getId(),
                "Complaint Received",
                "Your complaint " + c.getComplaintNumber() + " has been registered.",
                "📋", c.getId()));

        // Send email notification
        emailService.sendComplaintReceivedEmail(citizen.getEmail(), citizen.getFirstName(), c.getComplaintNumber(),
                c.getTitle());

        return ComplaintData.from(c);
    }

    // ── Citizen: my complaints ─────────────────────────────────────────────────
    public List<ComplaintData> getMine(String citizenEmail) {
        User citizen = userRepo.findByEmail(citizenEmail).orElseThrow();
        return complaintRepo.findByCitizenIdOrderByCreatedAtDesc(citizen.getId())
                .stream().map(ComplaintData::from).collect(Collectors.toList());
    }

    // ── Citizen: single complaint ──────────────────────────────────────────────
    public ComplaintData getById(String id) {
        return ComplaintData.from(complaintRepo.findById(id).orElseThrow());
    }

    // ── Citizen: feedback ─────────────────────────────────────────────────────
    public ComplaintData submitFeedback(String id, ComplaintRequest.SubmitFeedback req) {
        Complaint c = complaintRepo.findById(id).orElseThrow();
        c.setRating(req.getRating());
        c.setFeedback(req.getFeedback());
        complaintRepo.save(c);
        return ComplaintData.from(c);
    }

    // ── Officer: all complaints (filtered by department) ──────────────────────
    public List<ComplaintData> getAllForOfficer(String officerEmail) {
        User officer = userRepo.findByEmail(officerEmail).orElseThrow();

        // If Admin or Full Access Officer, show everything
        if (officer.getRole() == User.Role.ADMIN || officer.isFullAccess()) {
            return getAll();
        }

        // Otherwise filter by department (Category)
        if (officer.getDepartment() == null || officer.getDepartment().isBlank()) {
            return Collections.emptyList();
        }

        try {
            Complaint.Category deptCat = Complaint.Category.fromString(officer.getDepartment());
            return complaintRepo.findByCategoryOrderByCreatedAtDesc(deptCat)
                    .stream().map(ComplaintData::from).collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    // ── Admin: all complaints ───────────────────────────────────────
    public List<ComplaintData> getAll() {
        return complaintRepo.findByOrderByCreatedAtDesc()
                .stream().map(ComplaintData::from).collect(Collectors.toList());
    }

    // ── Officer: assigned complaints ──────────────────────────────────────────
    public List<ComplaintData> getAssigned(String officerEmail) {
        User officer = userRepo.findByEmail(officerEmail).orElseThrow();
        return complaintRepo.findByAssignedOfficerIdOrderByCreatedAtDesc(officer.getId())
                .stream().map(ComplaintData::from).collect(Collectors.toList());
    }

    // ── Officer / Admin: update status ────────────────────────────────────────
    public ComplaintData updateStatus(String id, String updaterEmail, ComplaintRequest.UpdateStatus req) {
        User updater = userRepo.findByEmail(updaterEmail).orElseThrow();
        Complaint c = complaintRepo.findById(id).orElseThrow();

        c.setStatus(req.getStatus());
        c.setUpdatedAt(LocalDateTime.now());
        c.getStatusHistory().add(
                new Complaint.StatusLog(req.getStatus(), updater.getFullName(), req.getNote()));
        complaintRepo.save(c);

        // Notify the citizen
        String msg = "Your complaint " + c.getComplaintNumber() +
                " status updated to " + req.getStatus().name().replace("_", " ");
        notifRepo.save(new Notification(c.getCitizenId(), "Status Update", msg, "🔄", c.getId()));

        // Send email if closed/resolved
        log.info("Status update for {}: New status is {}", c.getComplaintNumber(), req.getStatus());
        
        if (req.getStatus() == Complaint.Status.RESOLVED || req.getStatus() == Complaint.Status.CLOSED) {
            String citizenId = c.getCitizenId();
            log.info("Attempting to send resolution email for complaint {} to citizen ID: {}", 
                c.getComplaintNumber(), citizenId);
            
            if (citizenId == null || citizenId.isBlank()) {
                log.error("CANNOT SEND EMAIL: citizenId is missing in complaint {}", c.getComplaintNumber());
            } else {
                userRepo.findById(citizenId).ifPresentOrElse(
                    citizen -> {
                        log.info("Found citizen {}. Calling EmailService.sendComplaintResolvedEmail...", citizen.getEmail());
                        emailService.sendComplaintResolvedEmail(
                            citizen.getEmail(), 
                            citizen.getFirstName(),
                            c.getComplaintNumber(), 
                            c.getTitle()
                        );
                    },
                    () -> log.error("CITIZEN NOT FOUND in database for ID: {}", citizenId)
                );
            }
        }

        return ComplaintData.from(c);
    }

    // ── Admin: assign officer ─────────────────────────────────────────────────
    public ComplaintData assignOfficer(String complaintId, String officerId) {
        Complaint c = complaintRepo.findById(complaintId).orElseThrow();
        c.setAssignedOfficerId(officerId);
        c.setStatus(Complaint.Status.UNDER_REVIEW);
        c.setUpdatedAt(LocalDateTime.now());
        complaintRepo.save(c);
        return ComplaintData.from(c);
    }

    // ── Stats: citizen ────────────────────────────────────────────────────────
    public CitizenStats getCitizenStats(String citizenEmail) {
        User citizen = userRepo.findByEmail(citizenEmail).orElseThrow();
        String cid = citizen.getId();

        long total = complaintRepo.countByCitizenId(cid);
        long resolved = complaintRepo.countByCitizenIdAndStatus(cid, Complaint.Status.RESOLVED);
        long inProg = complaintRepo.countByCitizenIdAndStatus(cid, Complaint.Status.IN_PROGRESS);
        // feedback given = complaints that have a rating
        long feedback = complaintRepo.findByCitizenIdOrderByCreatedAtDesc(cid)
                .stream().filter(c -> c.getRating() != null).count();

        return new CitizenStats(total, resolved, inProg, feedback);
    }

    // ── Stats: platform ───────────────────────────────────────────────────────
    public PlatformStats getPlatformStats() {
        long total = complaintRepo.count();
        long resolved = complaintRepo.countByStatus(Complaint.Status.RESOLVED);
        long inProg = complaintRepo.countByStatus(Complaint.Status.IN_PROGRESS);
        long open = complaintRepo.countByStatus(Complaint.Status.OPEN);
        return new PlatformStats(total, resolved, inProg, open);
    }

    // ── Analytics: category breakdown ─────────────────────────────────────────
    public List<CategoryCount> getCategoryStats(String officerEmail) {
        User officer = userRepo.findByEmail(officerEmail).orElseThrow();
        List<Complaint> all = complaintRepo.findAll();

        // Apply departmental filter if necessary
        if (officer.getRole() == User.Role.OFFICER && !officer.isFullAccess() && officer.getDepartment() != null) {
            try {
                Complaint.Category dept = Complaint.Category.fromString(officer.getDepartment());
                all = all.stream()
                        .filter(c -> c.getCategory() == dept)
                        .collect(Collectors.toList());
            } catch (Exception ignored) {}
        }

        Map<String, Long> map = all.stream()
                .map(c -> c.getCategory() != null ? formatCategory(c.getCategory().name()) : "General")
                .collect(Collectors.groupingBy(cat -> cat, Collectors.counting()));

        return map.entrySet().stream()
                .map(e -> new CategoryCount(e.getKey(), e.getValue()))
                .sorted(Comparator.comparingLong(CategoryCount::getValue).reversed())
                .collect(Collectors.toList());
    }

    public List<CategoryCount> getLocalityStats(String officerEmail) {
        User officer = userRepo.findByEmail(officerEmail).orElseThrow();
        List<Complaint> all = complaintRepo.findAll();

        // Apply departmental filter if necessary
        if (officer.getRole() == User.Role.OFFICER && !officer.isFullAccess() && officer.getDepartment() != null) {
            try {
                Complaint.Category dept = Complaint.Category.fromString(officer.getDepartment());
                all = all.stream()
                        .filter(c -> c.getCategory() == dept)
                        .collect(Collectors.toList());
            } catch (Exception ignored) {}
        }

        Map<String, Long> map = all.stream()
                .map(c -> {
                    if (c.getLocality() != null && !c.getLocality().isBlank()) return c.getLocality();
                    if (c.getLocation() != null && !c.getLocation().isBlank()) {
                        String loc = c.getLocation();
                        if (loc.contains(",")) return loc.split(",")[0].trim();
                        return loc;
                    }
                    return "Other";
                })
                .collect(Collectors.groupingBy(l -> l, Collectors.counting()));

        return map.entrySet().stream()
                .map(e -> new CategoryCount(e.getKey(), e.getValue()))
                .sorted(Comparator.comparingLong(CategoryCount::getValue).reversed())
                .collect(Collectors.toList());
    }

    public List<TrendPoint> getTrend(String officerEmail, int days) {
        User officer = userRepo.findByEmail(officerEmail).orElseThrow();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("d MMM", java.util.Locale.ENGLISH);
        List<Complaint> all = complaintRepo.findAll();

        // Apply departmental filter if necessary
        if (officer.getRole() == User.Role.OFFICER && !officer.isFullAccess() && officer.getDepartment() != null) {
            try {
                Complaint.Category dept = Complaint.Category.fromString(officer.getDepartment());
                all = all.stream()
                        .filter(c -> c.getCategory() == dept)
                        .collect(Collectors.toList());
            } catch (Exception ignored) {}
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime cutoff = now.minusDays(days);
        
        Map<String, Long> map = new java.util.LinkedHashMap<>();
        for (int i = (days - 1); i >= 0; i--) {
            map.put(now.minusDays(i).format(fmt), 0L);
        }

        all.stream()
                .filter(c -> c.getCreatedAt() != null && c.getCreatedAt().isAfter(cutoff))
                .forEach(c -> {
                    String dateStr = c.getCreatedAt().format(fmt);
                    map.computeIfPresent(dateStr, (k, v) -> v + 1);
                });

        return map.entrySet().stream()
                .map(e -> new TrendPoint(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private String generateNumber() {
        return "#" + (10000 + (int) (Math.random() * 90000));
    }

    private String formatCategory(String raw) {
        return Arrays.stream(raw.split("_"))
                .map(w -> w.charAt(0) + w.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
    }
}
