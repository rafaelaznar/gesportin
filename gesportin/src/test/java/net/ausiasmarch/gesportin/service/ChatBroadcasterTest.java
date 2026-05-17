package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import net.ausiasmarch.gesportin.dto.MensajeChatDTO;

class ChatBroadcasterTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private ChatBroadcaster chatBroadcaster;

    private MensajeChatDTO dto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        dto = new MensajeChatDTO();
        dto.setId(1L);
        dto.setContenido("Hola equipo");
        dto.setFechaEnvio(LocalDateTime.now());
        dto.setIdClub(1L);
        dto.setIdUsuario(10L);
        dto.setNombreUsuario("Diego");
        dto.setApellido1Usuario("García");
    }

    @Test
    void broadcast_enviaStompYSse() throws Exception {
        SseEmitter emitter = mock(SseEmitter.class);
        chatBroadcaster.register(1L, emitter);

        chatBroadcaster.broadcast(1L, dto);

        verify(messagingTemplate).convertAndSend(eq("/topic/chat/club/1"), eq(dto));
        verify(emitter).send(any(SseEmitter.SseEventBuilder.class));
    }

    @Test
    void broadcast_noEnviaAOtroClub() throws Exception {
        SseEmitter emitterClub2 = mock(SseEmitter.class);
        chatBroadcaster.register(2L, emitterClub2);

        chatBroadcaster.broadcast(1L, dto);

        verify(emitterClub2, never()).send(any(SseEmitter.SseEventBuilder.class));
    }

    @Test
    void unregister_eliminaEmitter() throws Exception {
        SseEmitter emitter = mock(SseEmitter.class);
        chatBroadcaster.register(1L, emitter);
        chatBroadcaster.unregister(1L, emitter);

        chatBroadcaster.broadcast(1L, dto);

        verify(emitter, never()).send(any(SseEmitter.SseEventBuilder.class));
    }

    @Test
    void broadcast_emitterFallido_seEliminaAutomaticamente() throws Exception {
        SseEmitter emitter = mock(SseEmitter.class);
        doThrow(new RuntimeException("conexión rota")).when(emitter).send(any(SseEmitter.SseEventBuilder.class));
        chatBroadcaster.register(1L, emitter);

        chatBroadcaster.broadcast(1L, dto); // intento fallido → lo elimina
        chatBroadcaster.broadcast(1L, dto); // segunda llamada: emitter ya no está

        verify(emitter, times(1)).send(any(SseEmitter.SseEventBuilder.class));
    }
}
