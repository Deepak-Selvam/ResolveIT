package com.resolveit.controller;

import com.resolveit.dto.request.ContactRequest;
import com.resolveit.dto.response.ApiResponse.Success;
import com.resolveit.service.impl.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final EmailService emailService;

    @PostMapping
    public ResponseEntity<Success<Void>> contactUs(@Valid @RequestBody ContactRequest req) {
        emailService.sendContactEmail(req.getName(), req.getEmail(), req.getSubject(), req.getMessage());
        return ResponseEntity.ok(new Success<>("Your message has been sent. We will get back to you soon!", null));
    }
}
