package com.healthhive.service;

import com.healthhive.model.Notification;
import com.healthhive.model.User;
import com.healthhive.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired private NotificationRepository repo;

    public List<Notification> getUserNotifications(Long userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(Long id, Long userId) {
        Notification notification = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!notification.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        notification.setRead(true);
        repo.save(notification);
    }

    public void markAllAsRead(Long userId) {
        List<Notification> notifs = repo.findByUserIdOrderByCreatedAtDesc(userId);
        notifs.forEach(n -> n.setRead(true));
        repo.saveAll(notifs);
    }

    public void sendNotification(User user, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        repo.save(notification);
    }
}
