package com.healthhive.service;

import com.healthhive.model.MentalHealthMessage;
import com.healthhive.model.Reaction;
import com.healthhive.model.User;
import com.healthhive.repository.MentalHealthRepository;
import com.healthhive.repository.ReactionRepository;
import com.healthhive.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class MentalHealthSupportService {

    private final MentalHealthRepository messageRepo;
    private final ReactionRepository reactionRepo;
    private final UserRepository userRepo;

    public MentalHealthSupportService(MentalHealthRepository messageRepo,
                                      ReactionRepository reactionRepo,
                                      UserRepository userRepo) {
        this.messageRepo = messageRepo;
        this.reactionRepo = reactionRepo;
        this.userRepo = userRepo;
    }

    // Save a new message
    public MentalHealthMessage postMessage(String content) {
        MentalHealthMessage message = new MentalHealthMessage();
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        return messageRepo.save(message);
    }

    // Get all messages with reaction summary
    public List<Map<String, Object>> getAllMessagesWithReactions() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username).orElseThrow();

        List<MentalHealthMessage> messages = messageRepo.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
        List<Map<String, Object>> result = new ArrayList<>();

        for (MentalHealthMessage msg : messages) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", msg.getId());
            map.put("content", msg.getContent());
            map.put("timestamp", msg.getTimestamp());

            List<Reaction> reactions = reactionRepo.findByMessage(msg);
            Map<String, Long> counts = new HashMap<>(Map.of("like", 0L, "love", 0L, "dislike", 0L));
            String userReaction = null;

            for (Reaction r : reactions) {
                counts.put(r.getType(), counts.get(r.getType()) + 1);
                if (r.getUser().equals(user)) {
                    userReaction = r.getType();
                }
            }

            map.put("reactions", counts);
            map.put("userReaction", userReaction);
            result.add(map);
        }

        return result;
    }

    // Add or update user's reaction to a message
    public void reactToMessage(Long messageId, String type) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username).orElseThrow();
        MentalHealthMessage message = messageRepo.findById(messageId).orElseThrow();

        Reaction reaction = reactionRepo.findByUserAndMessage(user, message)
                .orElse(new Reaction());

        reaction.setUser(user);
        reaction.setMessage(message);
        reaction.setType(type);

        reactionRepo.save(reaction);
    }
}
