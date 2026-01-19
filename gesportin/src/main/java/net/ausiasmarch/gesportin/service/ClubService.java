package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.ClubEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.ClubRepository;

@Service
public class ClubService {

    @Autowired
    private ClubRepository oClubRepository;

    @Autowired
    private UsuarioService oUsuarioService;

    private final Random random = new Random();

    public ClubEntity get(Long id) {
        return oClubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado con id: " + id));
    }

    public Page<ClubEntity> getPage(Pageable pageable) {
        return oClubRepository.findAll(pageable);
    }

    public ClubEntity create(ClubEntity oClubEntity) {
        oClubEntity.setId(null);
        oClubEntity.setFechaAlta(LocalDateTime.now());
        oClubEntity.setPresidente(oClubEntity.getPresidente());
        oClubEntity.setVicepresidente(oClubEntity.getVicepresidente());
        return oClubRepository.save(oClubEntity);
    }

    public ClubEntity update(ClubEntity oClubEntity) {
        ClubEntity oClubExistente = oClubRepository.findById(oClubEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado con id: " + oClubEntity.getId()));

        oClubExistente.setNombre(oClubEntity.getNombre());
        oClubExistente.setDireccion(oClubEntity.getDireccion());
        oClubExistente.setTelefono(oClubEntity.getTelefono());
        oClubExistente.setFechaAlta(oClubEntity.getFechaAlta());
        oClubExistente.setPresidente(oClubEntity.getPresidente());
        oClubExistente.setVicepresidente(oClubEntity.getVicepresidente());
        return oClubRepository.save(oClubExistente);
    }

    public Long delete(Long id) {
        ClubEntity club = oClubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado con id: " + id));
        oClubRepository.delete(club);
        return id;
    }

    public Long empty() {
        oClubRepository.deleteAll();
        oClubRepository.flush();
        return 0L;
    }

    public Long count() {
        return oClubRepository.count();
    }

    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {
            ClubEntity club = new ClubEntity();
            club.setNombre("Club " + i);
            club.setDireccion("Dirección " + i);
            club.setTelefono("600000" + i);
            club.setFechaAlta(LocalDateTime.now());
            // club.setImagen(("imagen" + i).getBytes());
            club.setPresidente(oUsuarioService.getOneRandom());
            club.setVicepresidente(oUsuarioService.getOneRandom());
            oClubRepository.save(club);
        }
        return cantidad;
    }

    public ClubEntity getOneRandom() {
        Long count = oClubRepository.count();
        if (count == 0) {
            return null;
        }
        int index = random.nextInt(count.intValue());
        return oClubRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }
}
