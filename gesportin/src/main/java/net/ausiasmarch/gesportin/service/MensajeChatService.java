package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.dto.MensajeChatDTO;
import net.ausiasmarch.gesportin.entity.ClubEntity;
import net.ausiasmarch.gesportin.entity.MensajeChatEntity;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.MensajeChatRepository;

@Service
public class MensajeChatService {

    @Autowired
    private MensajeChatRepository oMensajeChatRepository;

    @Autowired
    private SessionService oSessionService;

    @Autowired
    private UsuarioService oUsuarioService;

    @Autowired
    private ClubService oClubService;

    public MensajeChatDTO enviar(String contenido) {
        if (!oSessionService.isSessionActive()) {
            throw new UnauthorizedException("Debe iniciar sesión para enviar mensajes");
        }
        Long idUsuario = oSessionService.getIdUsuario();
        Long idClub = oSessionService.getIdClub();
        if (idClub == null) {
            throw new UnauthorizedException("El usuario no pertenece a ningún club");
        }
        UsuarioEntity usuario = oUsuarioService.get(idUsuario);
        ClubEntity club = oClubService.get(idClub);

        MensajeChatEntity mensaje = new MensajeChatEntity();
        mensaje.setContenido(contenido);
        mensaje.setFechaEnvio(LocalDateTime.now());
        mensaje.setUsuario(usuario);
        mensaje.setClub(club);

        MensajeChatEntity guardado = oMensajeChatRepository.save(mensaje);
        return MensajeChatDTO.fromEntity(guardado);
    }

    public MensajeChatDTO enviar(String contenido, Long idUsuario, Long idClub) {
        UsuarioEntity usuario = oUsuarioService.get(idUsuario);
        ClubEntity club = oClubService.get(idClub);

        MensajeChatEntity mensaje = new MensajeChatEntity();
        mensaje.setContenido(contenido);
        mensaje.setFechaEnvio(LocalDateTime.now());
        mensaje.setUsuario(usuario);
        mensaje.setClub(club);

        MensajeChatEntity guardado = oMensajeChatRepository.save(mensaje);
        return MensajeChatDTO.fromEntity(guardado);
    }

    public Page<MensajeChatDTO> historial(Long idClub, Pageable pageable) {
        oSessionService.checkSameClub(idClub);
        return oMensajeChatRepository
                .findByClubIdOrderByFechaEnvioDesc(idClub, pageable)
                .map(MensajeChatDTO::fromEntity);
    }

    public Long count(Long idClub) {
        oSessionService.checkSameClub(idClub);
        return oMensajeChatRepository.countByClubId(idClub);
    }
}
