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

    private final Random random = new Random();

    public ClubEntity get(Long id) {
        return oClubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado con id: " + id));
    }

    public Page<ClubEntity> getPage(Pageable pageable) {
        return oClubRepository.findAll(pageable);
    }

    public ClubEntity create(ClubEntity club) {
        club.setId(null);
        club.setFechaAlta(LocalDateTime.now());
        return oClubRepository.save(club);
    }

    public ClubEntity update(ClubEntity club) {
        ClubEntity clubExistente = oClubRepository.findById(club.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado con id: " + club.getId()));
        
        clubExistente.setNombre(club.getNombre());
        clubExistente.setDireccion(club.getDireccion());
        clubExistente.setTelefono(club.getTelefono());
        clubExistente.setFechaAlta(club.getFechaAlta());
        //clubExistente.setIdPresidente(club.getIdPresidente());
        //clubExistente.setIdVicepresidente(club.getIdVicepresidente());
        clubExistente.setImagen(club.getImagen());
        
        return oClubRepository.save(clubExistente);
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
            //club.setIdPresidente((long) (random.nextInt(50) + 1));
            //club.setIdVicepresidente((long) (random.nextInt(50) + 1));
            club.setImagen(("imagen" + i).getBytes());
            oClubRepository.save(club);
        }
        return cantidad;
    }
}
