package net.ausiasmarch.gesportin.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.service.ChatBroadcaster;
import net.ausiasmarch.gesportin.service.SessionService;

class ChatSseApiTest {

    @Mock
    private SessionService sessionService;

    @Mock
    private ChatBroadcaster chatBroadcaster;

    @InjectMocks
    private ChatSseApi chatSseApi;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void stream_mismoClub_devuelveEmitterYRegistra() {
        doNothing().when(sessionService).checkSameClub(1L);

        SseEmitter emitter = chatSseApi.stream(1L);

        assertThat(emitter).isNotNull();
        verify(chatBroadcaster).register(eq(1L), any(SseEmitter.class));
    }

    @Test
    void stream_otroClub_lanzaUnauthorizedYNoRegistra() {
        doThrow(new UnauthorizedException("Acceso denegado")).when(sessionService).checkSameClub(99L);

        assertThatThrownBy(() -> chatSseApi.stream(99L))
                .isInstanceOf(UnauthorizedException.class);

        verify(chatBroadcaster, never()).register(any(), any());
    }
}
