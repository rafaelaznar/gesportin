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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import net.ausiasmarch.gesportin.dtoconverter.ClubConverter;
import net.ausiasmarch.gesportin.dto.ClubDTO;
import net.ausiasmarch.gesportin.entity.ClubEntity;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.ClubRepository;

class ClubServiceTest {

    @Mock
    private ClubRepository clubRepository;

    @Mock
    private SessionService sessionService;

    @Mock
    private ClubConverter clubConverter;

    @InjectMocks
    private ClubService clubService;

    private ClubEntity exampleClub;
    private ClubDTO exampleClubDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        exampleClub = new ClubEntity();
        exampleClub.setId(42L);
        exampleClub.setNombre("Test Club");

        exampleClubDTO = new ClubDTO();
        exampleClubDTO.setId(42L);
        exampleClubDTO.setNombre("Test Club");
    }

    @Test
    void get_whenEquipoAdminSameClub_shouldReturnClub() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        when(sessionService.getIdClub()).thenReturn(42L);
        // do not throw when checkSameClub is called
        doNothing().when(sessionService).checkSameClub(42L);
        when(clubRepository.findById(42L)).thenReturn(Optional.of(exampleClub));
        when(clubConverter.toDTO(exampleClub)).thenReturn(exampleClubDTO);

        ClubDTO result = clubService.get(42L);
        assertEquals(exampleClubDTO, result);
        verify(sessionService).checkSameClub(42L);
    }

    @Test
    void get_whenEquipoAdminDifferentClub_shouldThrowUnauthorized() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        doThrow(new UnauthorizedException("Acceso denegado")).when(sessionService).checkSameClub(99L);

        assertThrows(UnauthorizedException.class, () -> clubService.get(99L));
        verify(sessionService).checkSameClub(99L);
    }

    @Test
    void getPage_whenEquipoAdmin_shouldReturnOnlyOwnClub() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        when(sessionService.getIdClub()).thenReturn(42L);
        when(clubRepository.findById(42L)).thenReturn(Optional.of(exampleClub));
        when(clubConverter.toDTO(exampleClub)).thenReturn(exampleClubDTO);

        Page<ClubDTO> page = clubService.getPage(PageRequest.of(0, 10));
        assertEquals(1, page.getTotalElements());
        assertEquals(exampleClubDTO, page.getContent().get(0));
    }

    @Test
    void create_whenEquipoAdmin_shouldDeny() {
        doThrow(new UnauthorizedException("nope")).when(sessionService).denyEquipoAdmin();
        ClubEntity newClub = new ClubEntity();
        assertThrows(UnauthorizedException.class, () -> clubService.create(newClub));
    }

    @Test
    void delete_whenEquipoAdmin_shouldDeny() {
        doThrow(new UnauthorizedException("nope")).when(sessionService).denyEquipoAdmin();
        assertThrows(UnauthorizedException.class, () -> clubService.delete(1L));
    }

    @Test
    void count_whenEquipoAdmin_shouldReturnOne() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        when(sessionService.getIdClub()).thenReturn(42L);
        assertEquals(1L, clubService.count());
    }

    @Test
    void count_whenEquipoAdminNoClub_shouldReturnZero() {
        when(sessionService.isEquipoAdmin()).thenReturn(true);
        when(sessionService.getIdClub()).thenReturn(null);
        assertEquals(0L, clubService.count());
    }
}
