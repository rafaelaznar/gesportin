package net.ausiasmarch.gesportin.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.UsuarioRepository;

class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private SessionService sessionService;

    @InjectMocks
    private UsuarioService usuarioService;

    private UsuarioEntity exampleUsuario;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        exampleUsuario = new UsuarioEntity();
        exampleUsuario.setId(1L);
        exampleUsuario.setClub(new net.ausiasmarch.gesportin.entity.ClubEntity());
        exampleUsuario.getClub().setId(42L);
    }

    @Test
    void get_whenEquipoAdminSameClub_shouldReturnUsuario() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(exampleUsuario));

        UsuarioEntity result = usuarioService.get(1L);
        assertEquals(exampleUsuario, result);
        verify(sessionService).checkSameClub(42L);
    }

    @Test
    void get_whenEquipoAdminDifferentClub_shouldThrowUnauthorized() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(exampleUsuario));
        doThrow(new UnauthorizedException("nope")).when(sessionService).checkSameClub(99L);

        // modify club id to a different value before calling
        exampleUsuario.getClub().setId(99L);
        assertThrows(UnauthorizedException.class, () -> usuarioService.get(1L));
        verify(sessionService).checkSameClub(99L);
    }

    @Test
    void getPage_whenEquipoAdmin_noFilter_shouldRestrictToClub() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        when(sessionService.getIdClub()).thenReturn(42L);
        Page<UsuarioEntity> page = new PageImpl<>(java.util.Collections.singletonList(exampleUsuario));
        when(usuarioRepository.findByClubId(42L, PageRequest.of(0, 10))).thenReturn(page);

        Page<UsuarioEntity> result = usuarioService.getPage(PageRequest.of(0, 10), null, null, null, null, null);
        assertEquals(1, result.getTotalElements());
        assertEquals(exampleUsuario, result.getContent().get(0));
    }

    @Test
    void create_whenEquipoAdmin_shouldDeny() {
        doThrow(new UnauthorizedException("nope")).when(sessionService).denyEquipoAdmin();
        UsuarioEntity nuevo = new UsuarioEntity();
        assertThrows(UnauthorizedException.class, () -> usuarioService.create(nuevo));
    }

    @Test
    void update_whenEquipoAdmin_shouldDeny() {
        doThrow(new UnauthorizedException("nope")).when(sessionService).denyEquipoAdmin();
        UsuarioEntity existente = new UsuarioEntity();
        existente.setId(1L);
        assertThrows(UnauthorizedException.class, () -> usuarioService.update(existente));
    }

    @Test
    void delete_whenEquipoAdmin_shouldDeny() {
        doThrow(new UnauthorizedException("nope")).when(sessionService).denyEquipoAdmin();
        assertThrows(UnauthorizedException.class, () -> usuarioService.delete(1L));
    }

    @Test
    void count_whenEquipoAdmin_shouldReturnClubCount() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        when(sessionService.getIdClub()).thenReturn(42L);
        Page<UsuarioEntity> page = new PageImpl<>(java.util.Collections.emptyList(), PageRequest.of(0,1), 5);
        when(usuarioRepository.findByClubId(42L, PageRequest.ofSize(1))).thenReturn(page);
        assertEquals(5L, usuarioService.count());
    }
}
