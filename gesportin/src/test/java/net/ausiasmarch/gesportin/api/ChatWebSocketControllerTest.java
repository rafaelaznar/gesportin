package net.ausiasmarch.gesportin.api;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import net.ausiasmarch.gesportin.dto.MensajeChatDTO;
import net.ausiasmarch.gesportin.entity.ClubEntity;
import net.ausiasmarch.gesportin.entity.TipousuarioEntity;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.UsuarioRepository;
import net.ausiasmarch.gesportin.service.ChatBroadcaster;
import net.ausiasmarch.gesportin.service.MensajeChatService;

class ChatWebSocketControllerTest {

    @Mock
    private MensajeChatService mensajeChatService;

    @Mock
    private ChatBroadcaster chatBroadcaster;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private ChatWebSocketController controller;

    private ClubEntity club1;
    private ClubEntity club2;
    private TipousuarioEntity tipoUsuario;
    private TipousuarioEntity tipoAdmin;
    private UsuarioEntity usuarioClub1;
    private UsuarioEntity adminGlobal;
    private Principal principal;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        club1 = new ClubEntity();
        club1.setId(1L);
        club1.setNombre("Club A");

        club2 = new ClubEntity();
        club2.setId(2L);
        club2.setNombre("Club B");

        tipoUsuario = new TipousuarioEntity();
        tipoUsuario.setId(3L);
        tipoUsuario.setDescripcion("usuario");

        tipoAdmin = new TipousuarioEntity();
        tipoAdmin.setId(1L);
        tipoAdmin.setDescripcion("admin");

        usuarioClub1 = new UsuarioEntity();
        usuarioClub1.setId(10L);
        usuarioClub1.setUsername("diego");
        usuarioClub1.setNombre("Diego");
        usuarioClub1.setApellido1("García");
        usuarioClub1.setApellido2("López");
        usuarioClub1.setPassword("pass");
        usuarioClub1.setGenero(1);
        usuarioClub1.setFechaAlta(LocalDateTime.now());
        usuarioClub1.setTipousuario(tipoUsuario);
        usuarioClub1.setClub(club1);

        adminGlobal = new UsuarioEntity();
        adminGlobal.setId(1L);
        adminGlobal.setUsername("admin");
        adminGlobal.setNombre("Admin");
        adminGlobal.setApellido1("Global");
        adminGlobal.setApellido2("Sistema");
        adminGlobal.setPassword("pass");
        adminGlobal.setGenero(1);
        adminGlobal.setFechaAlta(LocalDateTime.now());
        adminGlobal.setTipousuario(tipoAdmin);
        adminGlobal.setClub(club1);

        principal = () -> "diego";
    }

    @Test
    void enviar_usuarioMismoClub_persisteYBroadcast() {
        when(usuarioRepository.findFirstByUsername("diego")).thenReturn(Optional.of(usuarioClub1));
        MensajeChatDTO dto = new MensajeChatDTO();
        dto.setId(1L);
        dto.setContenido("Hola");
        dto.setFechaEnvio(LocalDateTime.now());
        dto.setIdClub(1L);
        dto.setIdUsuario(10L);
        dto.setNombreUsuario("Diego");
        dto.setApellido1Usuario("García");
        when(mensajeChatService.enviar("Hola", 10L, 1L)).thenReturn(dto);

        controller.enviar(1L, Map.of("contenido", "Hola"), principal);

        verify(mensajeChatService).enviar("Hola", 10L, 1L);
        verify(chatBroadcaster).broadcast(1L, dto);
    }

    @Test
    void enviar_usuarioOtroClub_lanzaUnauthorized() {
        when(usuarioRepository.findFirstByUsername("diego")).thenReturn(Optional.of(usuarioClub1));

        assertThatThrownBy(() -> controller.enviar(2L, Map.of("contenido", "Hola"), principal))
                .isInstanceOf(UnauthorizedException.class);

        verify(mensajeChatService, never()).enviar(any(), any(), any());
        verify(chatBroadcaster, never()).broadcast(any(), any());
    }

    @Test
    void enviar_adminGlobal_puedeCualquierClub() {
        Principal adminPrincipal = () -> "admin";
        when(usuarioRepository.findFirstByUsername("admin")).thenReturn(Optional.of(adminGlobal));
        MensajeChatDTO dto = new MensajeChatDTO();
        dto.setId(2L);
        dto.setContenido("Aviso");
        dto.setFechaEnvio(LocalDateTime.now());
        dto.setIdClub(2L);
        dto.setIdUsuario(1L);
        dto.setNombreUsuario("Admin");
        dto.setApellido1Usuario("Global");
        when(mensajeChatService.enviar("Aviso", 1L, 2L)).thenReturn(dto);

        controller.enviar(2L, Map.of("contenido", "Aviso"), adminPrincipal);

        verify(mensajeChatService).enviar("Aviso", 1L, 2L);
        verify(chatBroadcaster).broadcast(eq(2L), any());
    }

    @Test
    void enviar_usuarioNoEncontrado_lanzaUnauthorized() {
        when(usuarioRepository.findFirstByUsername("diego")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> controller.enviar(1L, Map.of("contenido", "Hola"), principal))
                .isInstanceOf(UnauthorizedException.class);
    }
}
