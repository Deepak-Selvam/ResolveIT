package com.resolveit.service.impl;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.mail.website-url}")
    private String websiteUrl;

    public void sendEmail(String to, String subject, String htmlContent) {
        log.info("Request to send email to: {} from: {} with subject: {}", to, fromEmail, subject);
        
        if (fromEmail == null || fromEmail.isBlank() || fromEmail.contains("your_email")) {
            log.warn("SKIPPING EMAIL: SMTP username is not configured. (Current value: {})", fromEmail);
            return;
        }

        // Send asynchronously to not block the main request
        CompletableFuture.runAsync(() -> {
            try {
                log.debug("Initializing MimeMessage for: {}", to);
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(fromEmail);
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(htmlContent, true); // true = HTML content

                log.debug("Sending email through SMTP server...");
                mailSender.send(message);
                log.info("SUCCESS: Email sent to: {}", to);
            } catch (Exception e) {
                log.error("FAILURE: Could not send email to {}. Error: {}", to, e.getMessage());
                e.printStackTrace();
            }
        });
    }

    // ── Pre-styled templates ───────────────────────────────────────────────────

    public void sendWelcomeEmail(String to, String name) {
        String content = String.format(
                """
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; background-color: #f8fafc;">
                            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                                <div style="background: #3b82f6; padding: 30px; text-align: center;">
                                    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Resolve IT</h1>
                                </div>
                                <div style="padding: 40px;">
                                    <h2 style="color: #0f172a; margin-top: 0;">Hello %s!</h2>
                                    <p style="font-size: 16px; color: #475569;">Thank you for joining our platform. We're dedicated to helping you resolve civic issues efficiently and transparently.</p>
                                    <p style="font-size: 16px; color: #475569;">Start by submitting your first complaint on our portal to make your locality better.</p>
                                    <div style="text-align: center; margin-top: 35px;">
                                        <a href='%s' style='background: #3b82f6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; transition: all 0.3s;'>Visit Portal</a>
                                    </div>
                                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;">
                                    <p style="font-size: 14px; color: #94a3b8; margin-bottom: 0;">Best regards,<br><b>The Resolve IT Team</b></p>
                                </div>
                            </div>
                        </div>
                        """,
                name, websiteUrl);
        sendEmail(to, "Welcome to Resolve IT!", content);
    }

    public void sendPasswordResetEmail(String to, String token) {
        String resetUrl = websiteUrl + "/reset-password?token=" + token;
        String content = String.format(
                """
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; background-color: #f8fafc;">
                            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                                <div style="background: #ef4444; padding: 30px; text-align: center;">
                                    <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
                                </div>
                                <div style="padding: 40px;">
                                    <h2 style="color: #0f172a; margin-top: 0;">Security Alert</h2>
                                    <p style="font-size: 16px; color: #475569;">Someone requested a password reset for your account. If this was not you, please ignore this email.</p>
                                    <p style="font-size: 16px; color: #475569;">Otherwise, click the button below to set a new password:</p>
                                    <div style="text-align: center; margin-top: 35px;">
                                        <a href='%s' style='background: #ef4444; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;'>Reset Password</a>
                                    </div>
                                    <p style="font-size: 14px; color: #ef4444; margin-top: 25px; text-align: center; font-weight: 500;">This link will expire in 1 hour.</p>
                                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;">
                                    <p style="font-size: 14px; color: #94a3b8; margin-bottom: 0;">Best regards,<br><b>The Resolve IT Team</b></p>
                                </div>
                            </div>
                        </div>
                        """,
                resetUrl);
        sendEmail(to, "Password Reset Request - Resolve IT", content);
    }

    public void sendComplaintReceivedEmail(String to, String name, String complaintNumber, String title) {
        String content = String.format(
                """
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; background-color: #f8fafc;">
                            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                                <div style="background: #3b82f6; padding: 30px; text-align: center;">
                                    <h1 style="color: white; margin: 0; font-size: 28px;">Complaint Registered</h1>
                                </div>
                                <div style="padding: 40px;">
                                    <h2 style="color: #0f172a; margin-top: 0;">Hello %s!</h2>
                                    <p style="font-size: 16px; color: #475569;">Your complaint has been successfully registered on Resolve IT.</p>
                                    <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 25px 0;">
                                        <p style="margin: 0; font-size: 14px; color: #64748b;">Complaint Details:</p>
                                        <p style="margin: 8px 0 0 0; font-size: 16px; color: #1e293b;"><b>ID:</b> %s</p>
                                        <p style="margin: 4px 0 0 0; font-size: 16px; color: #1e293b;"><b>Subject:</b> %s</p>
                                    </div>
                                    <p style="font-size: 16px; color: #475569;">Our team will review your grievance and update you as work progresses.</p>
                                    <div style="text-align: center; margin-top: 35px;">
                                        <a href='%s' style='background: #3b82f6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;'>Track Status</a>
                                    </div>
                                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;">
                                    <p style="font-size: 14px; color: #94a3b8; margin-bottom: 0;">Best regards,<br><b>The Resolve IT Team</b></p>
                                </div>
                            </div>
                        </div>
                        """,
                name, complaintNumber, title, websiteUrl + "/dashboard");
        sendEmail(to, "Complaint Received: " + complaintNumber, content);
    }

    public void sendComplaintResolvedEmail(String to, String name, String complaintNumber, String title) {
        String content = String.format(
                """
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; background-color: #f8fafc;">
                            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                                <div style="background: #059669; padding: 30px; text-align: center;">
                                    <h1 style="color: white; margin: 0; font-size: 28px;">Issue Resolved!</h1>
                                </div>
                                <div style="padding: 40px;">
                                    <h2 style="color: #0f172a; margin-top: 0;">Great news %s!</h2>
                                    <p style="font-size: 16px; color: #475569;">Your complaint <b>%s</b> regarding "<b>%s</b>" has been marked as <b>COMPLETED</b>.</p>
                                    <p style="font-size: 16px; color: #475569;">We hope the resolution meets your expectations. We'd love to hear your feedback on the experience.</p>
                                    <div style="text-align: center; margin-top: 35px;">
                                        <a href='%s' style='background: #059669; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;'>Give Feedback</a>
                                    </div>
                                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;">
                                    <p style="font-size: 14px; color: #94a3b8; margin-bottom: 0;">Best regards,<br><b>The Resolve IT Team</b></p>
                                </div>
                            </div>
                        </div>
                        """,
                name, complaintNumber, title, websiteUrl + "/dashboard");
        sendEmail(to, "Complaint Resolved: " + complaintNumber, content);
    }

    public void sendContactEmail(String name, String fromEmail, String subject, String message) {
        String content = String.format("""
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; background-color: #f8fafc;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                        <div style="background: #1e293b; padding: 30px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px;">New Message</h1>
                        </div>
                        <div style="padding: 40px;">
                            <h2 style="color: #0f172a; margin-top: 0;">Contact Request</h2>
                            <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 25px 0;">
                                <p style="margin: 0; font-size: 14px; color: #64748b;">From:</p>
                                <p style="margin: 4px 0 12px 0; font-size: 16px; color: #1e293b;"><b>%s</b> (%s)</p>
                                <p style="margin: 0; font-size: 14px; color: #64748b;">Subject:</p>
                                <p style="margin: 4px 0 0 0; font-size: 16px; color: #1e293b;"><b>%s</b></p>
                            </div>
                            <p style="font-size: 16px; color: #1e293b; font-weight: 600; margin-bottom: 10px;">Message:</p>
                            <p style="font-size: 15px; color: #475569; white-space: pre-wrap; background: #fff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px;">%s</p>
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;">
                            <p style="font-size: 14px; color: #94a3b8; margin-bottom: 0;">Resolve IT System Notification</p>
                        </div>
                    </div>
                </div>
                """, name, fromEmail, subject, message);
        sendEmail(this.fromEmail, "Contact Us: " + subject, content);
    }

}
