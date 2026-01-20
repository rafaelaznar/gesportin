package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.TemporadaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.TemporadaRepository;

@Service
public class TemporadaService {

    @Autowired
    private TemporadaRepository oTemporadaRepository;

    @Autowired
    private ClubService oClubService;

    private final String[] nombres = {
        "Temporada 2019/2020",
        "Temporada 2020/2021",
        "Temporada 2021/2022",
        "Temporada 2022/2023",
        "Temporada 2023/2024",
        "Temporada Primavera",
        "Temporada Verano",
        "Temporada Otoño",
        "Temporada Invierno",
        "Temporada Especial",
        "Temporada Juvenil",
        "Temporada Senior"
    };

    public TemporadaEntity get(Long id) {
        return oTemporadaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Temporada no encontrado con id: " + id));
    }

    public Page<TemporadaEntity> getPage(Pageable pageable) {
        return oTemporadaRepository.findAll(pageable);
    }

    public TemporadaEntity create(TemporadaEntity oTemporadaEntity) {
        oTemporadaEntity.setId(null);
        oTemporadaEntity.setClub(oClubService.get(oTemporadaEntity.getClub().getId()));
        return oTemporadaRepository.save(oTemporadaEntity);
    }

    public TemporadaEntity update(TemporadaEntity oTemporadaEntity) {
        TemporadaEntity oTemporadaExistente = oTemporadaRepository.findById(oTemporadaEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Temporada no encontrado con id: " + oTemporadaEntity.getId()));

        oTemporadaExistente.setDescripcion(oTemporadaEntity.getDescripcion());
        oTemporadaEntity.setClub(oClubService.get(oTemporadaEntity.getClub().getId()));
        return oTemporadaRepository.save(oTemporadaExistente);
    }

    public Long delete(Long id) {
        TemporadaEntity temporada = oTemporadaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Temporada no encontrado con id: " + id));
        oTemporadaRepository.delete(temporada);
        return id;
    }

    public Long empty() {
        oTemporadaRepository.deleteAll();
        oTemporadaRepository.flush();
        return 0L;
    }

    public Long count() {
        return oTemporadaRepository.count();
    }

    public Long fill(Long cantidad) {
        for (long i = 0; i < cantidad; i++) {
            TemporadaEntity oTemporada = new TemporadaEntity();
            int indice = (int) (Math.random() * nombres.length);
            oTemporada.setDescripcion(nombres[indice]);
            oTemporada.setClub(oClubService.getOneRandom());
            oTemporadaRepository.save(oTemporada);
        }
        return cantidad;
    }

    public TemporadaEntity getOneRandom() {
        Long count = oTemporadaRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oTemporadaRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }
}
