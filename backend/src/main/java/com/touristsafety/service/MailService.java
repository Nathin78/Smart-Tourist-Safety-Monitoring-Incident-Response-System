package com.touristsafety.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.Set;

@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final JavaMailSender mailSender;

    @Value("${alert.mail.to:}")
    private String alertRecipient;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendAlert(String subject, String body) {
        sendAlert(null, subject, body);
    }

    public void sendAlert(String recipient, String subject, String body) {
        Set<String> recipients = new LinkedHashSet<>();
        if (recipient != null && !recipient.isBlank()) {
            recipients.add(recipient.trim());
        }
        if (alertRecipient != null && !alertRecipient.isBlank()) {
            recipients.add(alertRecipient.trim());
        }

        if (recipients.isEmpty()) {
            log.warn("alert.mail.to is not configured; skipping alert email");
            return;
        }

        for (String targetRecipient : recipients) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(targetRecipient);
            if (fromAddress != null && !fromAddress.isBlank()) {
                message.setFrom(fromAddress);
            }
            message.setSubject(subject);
            message.setText(body);

            try {
                mailSender.send(message);
                log.info("Alert email sent to {}", targetRecipient);
            } catch (Exception ex) {
                log.error("Failed to send alert email to {}: {}", targetRecipient, ex.getMessage());
            }
        }
    }

    public void sendWelcomeEmail(String recipient, String name) {
        if (recipient == null || recipient.isBlank()) {
            log.warn("No recipient provided for welcome email; skipping");
            return;
        }

        String targetName = (name != null && !name.isBlank()) ? name.trim() : "Tourist";
        String subject = "Welcome to Tourist Safety Monitoring";
        String body = String.format(
                "Hello %s,%n%nWelcome to the Tourist Safety Monitoring system.%n" +
                "Your account has been created successfully, and you can now sign in to access your profile and safety features.%n%n" +
                "If you did not create this account, please contact support immediately.%n%n" +
                "Stay safe,%nTourist Safety Monitoring Team",
                targetName
        );

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipient.trim());
        if (fromAddress != null && !fromAddress.isBlank()) {
            message.setFrom(fromAddress);
        }
        message.setSubject(subject);
        message.setText(body);

        try {
            mailSender.send(message);
            log.info("Welcome email sent to {}", recipient.trim());
        } catch (Exception ex) {
            log.error("Failed to send welcome email to {}: {}", recipient.trim(), ex.getMessage());
        }
    }
}
