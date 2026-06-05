package net.ausiasmarch.gesportin.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

//import net.ausiasmarch.gesportin.dtoconverter.EquipoConverter;
import net.ausiasmarch.gesportin.dtoconverter.UsuarioConverter;
import net.ausiasmarch.gesportin.entity.EquipoEntity;
import net.ausiasmarch.gesportin.entity.JugadorEntity;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.JugadorRepository;
import net.ausiasmarch.gesportin.repository.UsuarioRepository;

class JugadorServiceTest {

    @Mock
    private JugadorRepository jugadorRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private UsuarioConverter usuarioConverter;

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private EquipoService equipoService;

    @Mock
    private SessionService sessionService;

    @InjectMocks
    private JugadorService jugadorService;

    private JugadorEntity exampleJugador;
    private UsuarioEntity exampleUsuario;
    private EquipoEntity exampleEquipo;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        exampleUsuario = new UsuarioEntity();
        exampleUsuario.setId(1L);
        exampleUsuario.setClub(new net.ausiasmarch.gesportin.entity.ClubEntity());
        exampleUsuario.getClub().setId(42L);

        exampleEquipo = new EquipoEntity();
        exampleEquipo.setId(2L);
        exampleEquipo.setCategoria(new net.ausiasmarch.gesportin.entity.CategoriaEntity());
        exampleEquipo.getCategoria().setTemporada(new net.ausiasmarch.gesportin.entity.TemporadaEntity());
        exampleEquipo.getCategoria().getTemporada().setClub(new net.ausiasmarch.gesportin.entity.ClubEntity());
        exampleEquipo.getCategoria().getTemporada().getClub().setId(42L);

        exampleJugador = new JugadorEntity();
        exampleJugador.setId(100L);
        exampleJugador.setUsuario(exampleUsuario);
        exampleJugador.setEquipo(exampleEquipo);
    }

    @Test
    void get_whenEquipoAdminSameClub_shouldReturn() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        when(jugadorRepository.findById(100L)).thenReturn(Optional.of(exampleJugador));

        JugadorEntity result = jugadorService.get(100L);
        assertEquals(exampleJugador, result);
        // club check called twice (usuario and equipo)
        verify(sessionService, times(2)).checkSameClub(42L);
    }

    @Test
    void get_whenEquipoAdminDifferentClub_shouldThrow() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        // create jugador from other club
        UsuarioEntity u2 = new UsuarioEntity();
        u2.setClub(new net.ausiasmarch.gesportin.entity.ClubEntity());
        u2.getClub().setId(99L);
        exampleJugador.setUsuario(u2);
        when(jugadorRepository.findById(100L)).thenReturn(Optional.of(exampleJugador));
        doThrow(new UnauthorizedException("nope")).when(sessionService).checkSameClub(99L);

        assertThrows(UnauthorizedException.class, () -> jugadorService.get(100L));
        verify(sessionService).checkSameClub(99L);
    }

    @Test
    void getPage_whenEquipoAdmin_noFilter_shouldRestrictToClub() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        when(sessionService.getIdClub()).thenReturn(42L);
        when(jugadorRepository.findByEquipoCategoriaTemporadaClubId(42L, PageRequest.of(0,10)))
                .thenReturn(new PageImpl<>(java.util.Collections.singletonList(exampleJugador)));

        Page<JugadorEntity> page = jugadorService.getPage(PageRequest.of(0,10), null, null, null);
        assertEquals(1, page.getTotalElements());
        assertEquals(exampleJugador, page.getContent().get(0));
    }

    @Test
    void create_whenEquipoAdmin_differentClub_shouldThrow() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        // usuario from another club
        UsuarioEntity u2 = new UsuarioEntity();
        u2.setId(3L);
        u2.setClub(new net.ausiasmarch.gesportin.entity.ClubEntity());
        u2.getClub().setId(99L);
        JugadorEntity nuevo = new JugadorEntity();
        nuevo.setUsuario(u2);
        nuevo.setEquipo(exampleEquipo);
        
        net.ausiasmarch.gesportin.dto.UsuarioDTO usuarioDTO = new net.ausiasmarch.gesportin.dto.UsuarioDTO(u2, 0, 0, 0, 0, 0, 0, 0);
        when(usuarioConverter.toDTO(u2)).thenReturn(usuarioDTO);
        when(usuarioService.get(3L)).thenReturn(usuarioDTO);
        net.ausiasmarch.gesportin.dto.EquipoDTO equipoDTO = new net.ausiasmarch.gesportin.dto.EquipoDTO(exampleEquipo, 0, 0, 0);
        when(equipoService.get(2L)).thenReturn(equipoDTO);
        doThrow(new UnauthorizedException("nope")).when(sessionService).checkSameClub(99L);

        assertThrows(UnauthorizedException.class, () -> jugadorService.create(nuevo));
    }

    @Test
    void delete_whenEquipoAdmin_sameClub_shouldCallCheck() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        when(jugadorRepository.findById(100L)).thenReturn(Optional.of(exampleJugador));

        Long id = jugadorService.delete(100L);
        assertEquals(100L, id);
        verify(sessionService, times(2)).checkSameClub(42L);
    }

    @Test
    void count_whenEquipoAdmin_shouldReturnClubCount() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        when(sessionService.getIdClub()).thenReturn(42L);
        Page<JugadorEntity> page = new PageImpl<>(java.util.Collections.emptyList(), PageRequest.of(0,1), 5);
        when(jugadorRepository.findByEquipoCategoriaTemporadaClubId(42L, PageRequest.ofSize(1))).thenReturn(page);
        assertEquals(5L, jugadorService.count());
    }
}
