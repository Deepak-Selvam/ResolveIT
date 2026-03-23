package com.resolveit.service.impl;

import com.resolveit.dto.response.ApiResponse.NotificationData;
import com.resolveit.model.User;
import com.resolveit.repository.NotificationRepository;
import com.resolveit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notifRepo;
    private final UserRepository         userRepo;

    public List<NotificationData> getAll(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return notifRepo.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(NotificationData::from).collect(Collectors.toList());
    }

    public long getUnreadCount(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return notifRepo.countByUserIdAndReadFalse(user.getId());
    }

    public void markAllRead(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        var unread = notifRepo.findByUserIdAndReadFalse(user.getId());
        unread.forEach(n -> n.setRead(true));
        notifRepo.saveAll(unread);
    }
}
