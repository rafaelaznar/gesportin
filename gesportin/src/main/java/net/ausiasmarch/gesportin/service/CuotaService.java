package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.CuotaEntity;
import net.ausiasmarch.gesportin.repository.CuotaRepository;

@Service
public class CuotaService {
    
    @Autowired
    CuotaRepository oCuotaRepository;

    public CuotaEntity get(Long id) {
        return oCuotaRepository.findById(id).orElseThrow(() -> new RuntimeException("Recurso not found"));
    }

    public Long create(CuotaEntity cuotaEntity) {
        cuotaEntity.setFecha(LocalDateTime.now());
        oCuotaRepository.save(cuotaEntity);
        return cuotaEntity.getId();
    }

    public Long update(CuotaEntity cuotaEntity) {
        CuotaEntity existingBlog = oCuotaRepository.findById(cuotaEntity.getId())
                .orElseThrow(() -> new RuntimeException("Recurso not found"));
        existingBlog.setNombre(cuotaEntity.getNombre());
        oCuotaRepository.save(existingBlog);
        return existingBlog.getId();
    }

    public Long delete(Long id) {
        oCuotaRepository.deleteById(id);
        return id;
    }

    public Page<CuotaEntity> getPage(Pageable oPageable) {
        return oCuotaRepository.findAll(oPageable);
    }

    public Long count() {
        return oCuotaRepository.count();
    }    

    public Long empty() {
        Long total = oCuotaRepository.count();
        oCuotaRepository.deleteAll();
        return total;
    }

    public Long generarDatos(int cantidad) {
        Random rnd = new Random();
        String[] nombres = {"Matrícula", "Mensualidad", "Cuota Extra", "Inscripción", "Cuota Anual"};
        long created = 0;
        for (int i = 0; i < cantidad; i++) {
            CuotaEntity c = new CuotaEntity();
            c.setNombre(nombres[rnd.nextInt(nombres.length)] + " " + (rnd.nextInt(9000) + 1000));
            c.setCantidad((float) (rnd.nextDouble() * 100.0 + 1.0));
            c.setFecha(LocalDateTime.now().minusDays(rnd.nextInt(365)));
            c.setId_temporada((long) (rnd.nextInt(5) + 1));
            oCuotaRepository.save(c);
            created++;
        }
        return created;
    }

}
