package net.ausiasmarch.gesportin.api;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.ausiasmarch.gesportin.dto.MensajeChatDTO;
import net.ausiasmarch.gesportin.service.ChatBroadcaster;
import net.ausiasmarch.gesportin.service.MensajeChatService;
import net.ausiasmarch.gesportin.service.SessionService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/chat")
public class MensajeChatApi {

    @Autowired
    private MensajeChatService oMensajeChatService;

    @Autowired
    private ChatBroadcaster oChatBroadcaster;

    @Autowired
    private SessionService oSessionService;

    @PostMapping("/mensaje")
    public ResponseEntity<MensajeChatDTO> enviar(@RequestBody Map<String, Object> body) {
        String contenido = (String) body.get("contenido");
        Object idClubObj = body.get("idClub");

        MensajeChatDTO dto;
        // Admin puede indicar el club destino explícitamente
        if (idClubObj != null && oSessionService.isAdmin()) {
            Long idClub = ((Number) idClubObj).longValue();
            Long idUsuario = oSessionService.getIdUsuario();
            dto = oMensajeChatService.enviar(contenido, idUsuario, idClub);
        } else {
            dto = oMensajeChatService.enviar(contenido);
        }

        oChatBroadcaster.broadcast(dto.getIdClub(), dto);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/club/{idClub}/mensajes")
    public ResponseEntity<Page<MensajeChatDTO>> historial(
            @PathVariable Long idClub,
            @PageableDefault(size = 50) Pageable pageable) {
        return ResponseEntity.ok(oMensajeChatService.historial(idClub, pageable));
    }

    @GetMapping("/club/{idClub}/count")
    public ResponseEntity<Long> count(@PathVariable Long idClub) {
        return ResponseEntity.ok(oMensajeChatService.count(idClub));
    }
}
