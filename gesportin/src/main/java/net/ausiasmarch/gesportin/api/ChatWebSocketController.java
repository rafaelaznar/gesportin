package net.ausiasmarch.gesportin.api;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import net.ausiasmarch.gesportin.dto.MensajeChatDTO;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.UsuarioRepository;
import net.ausiasmarch.gesportin.service.ChatBroadcaster;
import net.ausiasmarch.gesportin.service.MensajeChatService;

@Controller
public class ChatWebSocketController {

    @Autowired
    private MensajeChatService oMensajeChatService;

    @Autowired
    private ChatBroadcaster oChatBroadcaster;

    @Autowired
    private UsuarioRepository oUsuarioRepository;

    @MessageMapping("/chat/club/{idClub}")
    public void enviar(@DestinationVariable Long idClub,
            @Payload Map<String, String> payload,
            Principal principal) {

        UsuarioEntity usuario = oUsuarioRepository.findFirstByUsername(principal.getName())
                .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado"));

        if (!Long.valueOf(1L).equals(usuario.getTipousuario().getId())) {
            Long clubUsuario = usuario.getClub() != null ? usuario.getClub().getId() : null;
            if (clubUsuario == null || !clubUsuario.equals(idClub)) {
                throw new UnauthorizedException("Acceso denegado: solo puede operar en su propio club");
            }
        }

        MensajeChatDTO dto = oMensajeChatService.enviar(payload.get("contenido"), usuario.getId(), idClub);
        oChatBroadcaster.broadcast(idClub, dto);
    }
}
