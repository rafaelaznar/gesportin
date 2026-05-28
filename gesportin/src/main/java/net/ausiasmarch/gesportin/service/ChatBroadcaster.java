package net.ausiasmarch.gesportin.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import net.ausiasmarch.gesportin.dto.MensajeChatDTO;

@Service
public class ChatBroadcaster {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final ConcurrentHashMap<Long, List<SseEmitter>> emittersByClub = new ConcurrentHashMap<>();

    public void register(Long idClub, SseEmitter emitter) {
        emittersByClub.computeIfAbsent(idClub, k -> new CopyOnWriteArrayList<>()).add(emitter);
    }

    public void unregister(Long idClub, SseEmitter emitter) {
        List<SseEmitter> emitters = emittersByClub.get(idClub);
        if (emitters != null) {
            emitters.remove(emitter);
        }
    }

    public void broadcast(Long idClub, MensajeChatDTO dto) {
        messagingTemplate.convertAndSend("/topic/chat/club/" + idClub, dto);

        List<SseEmitter> emitters = emittersByClub.get(idClub);
        if (emitters != null) {
            List<SseEmitter> dead = new ArrayList<>();
            for (SseEmitter emitter : emitters) {
                try {
                    emitter.send(SseEmitter.event().data(dto));
                } catch (Exception e) {
                    dead.add(emitter);
                }
            }
            emitters.removeAll(dead);
        }
    }
}
