package net.ausiasmarch.gesportin.repository;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import net.ausiasmarch.gesportin.entity.ClubEntity;
import net.ausiasmarch.gesportin.entity.MensajeChatEntity;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;

class MensajeChatRepositoryIT {

    @Mock
    private MensajeChatRepository mensajeChatRepository;

    private ClubEntity club;
    private UsuarioEntity usuario;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        club = new ClubEntity();
        club.setId(1L);
        club.setNombre("Club Test");

        usuario = new UsuarioEntity();
        usuario.setId(1L);
        usuario.setNombre("Ana");
        usuario.setApellido1("García");
    }

    @Test
    void guardar_mensaje_devuelve_entidad_con_id() {
        MensajeChatEntity mensaje = mensajeEjemplo("Hola equipo");
        MensajeChatEntity guardado = mensajeEjemplo("Hola equipo");
        guardado.setId(1L);

        when(mensajeChatRepository.save(mensaje)).thenReturn(guardado);

        MensajeChatEntity resultado = mensajeChatRepository.save(mensaje);

        assertThat(resultado.getId()).isNotNull();
        assertThat(resultado.getContenido()).isEqualTo("Hola equipo");
    }

    @Test
    void findByClubId_devuelve_solo_mensajes_del_club() {
        MensajeChatEntity m1 = mensajeEjemplo("Msg club 1");
        m1.setId(1L);
        Pageable pageable = PageRequest.of(0, 10);
        Page<MensajeChatEntity> paginaMock = new PageImpl<>(List.of(m1));

        when(mensajeChatRepository.findByClubIdOrderByFechaEnvioDesc(1L, pageable)).thenReturn(paginaMock);

        Page<MensajeChatEntity> resultado = mensajeChatRepository.findByClubIdOrderByFechaEnvioDesc(1L, pageable);

        assertThat(resultado.getTotalElements()).isEqualTo(1);
        assertThat(resultado.getContent().get(0).getClub().getId()).isEqualTo(1L);
    }

    @Test
    void findByClubId_paginacion_respeta_tamano_pagina() {
        List<MensajeChatEntity> mensajes = List.of(
                mensajeConId(1L, "M1"),
                mensajeConId(2L, "M2"),
                mensajeConId(3L, "M3"));
        Pageable pageable = PageRequest.of(0, 3);
        Page<MensajeChatEntity> paginaMock = new PageImpl<>(mensajes, pageable, 5);

        when(mensajeChatRepository.findByClubIdOrderByFechaEnvioDesc(1L, pageable)).thenReturn(paginaMock);

        Page<MensajeChatEntity> resultado = mensajeChatRepository.findByClubIdOrderByFechaEnvioDesc(1L, pageable);

        assertThat(resultado.getTotalElements()).isEqualTo(5);
        assertThat(resultado.getContent()).hasSize(3);
    }

    @Test
    void countByClubId_devuelve_total_del_club() {
        when(mensajeChatRepository.countByClubId(1L)).thenReturn(2L);

        long total = mensajeChatRepository.countByClubId(1L);

        assertThat(total).isEqualTo(2L);
    }

    private MensajeChatEntity mensajeEjemplo(String contenido) {
        MensajeChatEntity m = new MensajeChatEntity();
        m.setContenido(contenido);
        m.setFechaEnvio(LocalDateTime.now());
        m.setClub(club);
        m.setUsuario(usuario);
        return m;
    }

    private MensajeChatEntity mensajeConId(Long id, String contenido) {
        MensajeChatEntity m = mensajeEjemplo(contenido);
        m.setId(id);
        return m;
    }
}
