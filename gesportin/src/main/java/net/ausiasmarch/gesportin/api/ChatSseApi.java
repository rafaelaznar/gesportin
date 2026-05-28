package net.ausiasmarch.gesportin.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import net.ausiasmarch.gesportin.service.ChatBroadcaster;
import net.ausiasmarch.gesportin.service.SessionService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/chat")
public class ChatSseApi {

    @Autowired
    private SessionService oSessionService;

    @Autowired
    private ChatBroadcaster oChatBroadcaster;

    @GetMapping(value = "/club/{idClub}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@PathVariable Long idClub) {
        oSessionService.checkSameClub(idClub);

        SseEmitter emitter = new SseEmitter(30 * 60 * 1000L);
        oChatBroadcaster.register(idClub, emitter);

        emitter.onCompletion(() -> oChatBroadcaster.unregister(idClub, emitter));
        emitter.onTimeout(() -> oChatBroadcaster.unregister(idClub, emitter));
        emitter.onError(e -> oChatBroadcaster.unregister(idClub, emitter));

        return emitter;
    }
}
