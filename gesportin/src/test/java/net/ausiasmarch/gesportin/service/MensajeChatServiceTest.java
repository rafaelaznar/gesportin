package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import net.ausiasmarch.gesportin.dto.MensajeChatDTO;
import net.ausiasmarch.gesportin.entity.ClubEntity;
import net.ausiasmarch.gesportin.entity.MensajeChatEntity;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.MensajeChatRepository;

import java.util.List;

class MensajeChatServiceTest {

    @Mock
    private MensajeChatRepository mensajeChatRepository;

    @Mock
    private SessionService sessionService;

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private ClubService clubService;

    @InjectMocks
    private MensajeChatService mensajeChatService;

    private ClubEntity club;
    private UsuarioEntity usuario;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        club = new ClubEntity();
        club.setId(1L);
        club.setNombre("Club A");

        usuario = new UsuarioEntity();
        usuario.setId(10L);
        usuario.setNombre("Diego");
        usuario.setApellido1("García");
        usuario.setClub(club);
    }

    @Test
    void enviar_sinSesion_lanzaUnauthorized() {
        when(sessionService.isSessionActive()).thenReturn(false);

        assertThatThrownBy(() -> mensajeChatService.enviar("Hola"))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void enviar_conSesion_persisteYDevuelveDTO() {
        when(sessionService.isSessionActive()).thenReturn(true);
        when(sessionService.getIdUsuario()).thenReturn(10L);
        when(sessionService.getIdClub()).thenReturn(1L);
        when(usuarioService.get(10L)).thenReturn(usuario);
        when(clubService.get(1L)).thenReturn(club);

        MensajeChatEntity guardado = new MensajeChatEntity(1L, "Hola equipo",
                LocalDateTime.now(), club, usuario);
        when(mensajeChatRepository.save(any(MensajeChatEntity.class))).thenReturn(guardado);

        MensajeChatDTO dto = mensajeChatService.enviar("Hola equipo");

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getContenido()).isEqualTo("Hola equipo");
        assertThat(dto.getIdClub()).isEqualTo(1L);
        assertThat(dto.getIdUsuario()).isEqualTo(10L);
        assertThat(dto.getNombreUsuario()).isEqualTo("Diego");
    }

    @Test
    void historial_crossClub_lanzaUnauthorized() {
        doThrow(new UnauthorizedException("Acceso denegado"))
                .when(sessionService).checkSameClub(99L);

        assertThatThrownBy(() -> mensajeChatService.historial(99L, PageRequest.of(0, 10)))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void historial_mismoClub_devuelvePagina() {
        doNothing().when(sessionService).checkSameClub(1L);

        MensajeChatEntity m = new MensajeChatEntity(1L, "Hola", LocalDateTime.now(), club, usuario);
        Page<MensajeChatEntity> pagina = new PageImpl<>(List.of(m));
        when(mensajeChatRepository.findByClubIdOrderByFechaEnvioDesc(1L, PageRequest.of(0, 10)))
                .thenReturn(pagina);

        Page<MensajeChatDTO> resultado = mensajeChatService.historial(1L, PageRequest.of(0, 10));

        assertThat(resultado.getTotalElements()).isEqualTo(1);
        assertThat(resultado.getContent().get(0).getContenido()).isEqualTo("Hola");
    }

    @Test
    void count_mismoClub_devuelveCuenta() {
        doNothing().when(sessionService).checkSameClub(1L);
        when(mensajeChatRepository.countByClubId(1L)).thenReturn(5L);

        assertThat(mensajeChatService.count(1L)).isEqualTo(5L);
    }
}
