package net.ausiasmarch.gesportin.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import net.ausiasmarch.gesportin.dtoconverter.UsuarioConverter;
import net.ausiasmarch.gesportin.dto.UsuarioDTO;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.UsuarioRepository;

class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private SessionService sessionService;

    @Mock
    private UsuarioConverter usuarioConverter;

    @InjectMocks
    private UsuarioService usuarioService;

    private UsuarioEntity exampleUsuario;
    private UsuarioDTO exampleUsuarioDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        exampleUsuario = new UsuarioEntity();
        exampleUsuario.setId(1L);
        exampleUsuario.setClub(new net.ausiasmarch.gesportin.entity.ClubEntity());
        exampleUsuario.getClub().setId(42L);

        exampleUsuarioDTO = new UsuarioDTO();
        exampleUsuarioDTO.setId(1L);
    }

    @Test
    void get_whenEquipoAdminSameClub_shouldReturnUsuario() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(exampleUsuario));
        when(usuarioConverter.toDTO(exampleUsuario)).thenReturn(exampleUsuarioDTO);

        UsuarioDTO result = usuarioService.get(1L);
        assertEquals(exampleUsuarioDTO, result);
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
        
        Page<UsuarioDTO> dtoPage = new PageImpl<>(java.util.Collections.singletonList(exampleUsuarioDTO));
        when(usuarioConverter.toPageDTO(page)).thenReturn(dtoPage);

        Page<UsuarioDTO> result = usuarioService.getPage(PageRequest.of(0, 10), null, null, null, null, null);
        assertEquals(1, result.getTotalElements());
        assertEquals(exampleUsuarioDTO, result.getContent().get(0));
    }

    @Test
    void create_whenEquipoAdmin_withoutClub_shouldDeny() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        when(sessionService.getIdClub()).thenReturn(42L);
        UsuarioEntity nuevo = new UsuarioEntity();
        // club is null, should be rejected for equipo admin
        assertThrows(UnauthorizedException.class, () -> usuarioService.create(nuevo));
    }

    @Test
    void update_whenEquipoAdmin_nonUsuarioType_shouldDeny() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        when(sessionService.getIdClub()).thenReturn(42L);

        // existing user is not of type "usuario" (tipousuario id != 3)
        exampleUsuario.setTipousuario(new net.ausiasmarch.gesportin.entity.TipousuarioEntity());
        exampleUsuario.getTipousuario().setId(2L);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(exampleUsuario));

        UsuarioEntity updateRequest = new UsuarioEntity();
        updateRequest.setId(1L);

        assertThrows(UnauthorizedException.class, () -> usuarioService.update(updateRequest));
    }

    @Test
    void delete_whenEquipoAdmin_nonUsuarioType_shouldDeny() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        when(sessionService.getIdClub()).thenReturn(42L);

        // user to delete is not of type "usuario" (tipousuario id != 3)
        exampleUsuario.setTipousuario(new net.ausiasmarch.gesportin.entity.TipousuarioEntity());
        exampleUsuario.getTipousuario().setId(2L);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(exampleUsuario));

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
