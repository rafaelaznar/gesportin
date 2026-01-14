package net.ausiasmarch.gesportin.service;

import java.math.BigDecimal;
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

    public CuotaEntity create(CuotaEntity cuotaEntity) {
        cuotaEntity.setId(null);
        cuotaEntity.setFecha(LocalDateTime.now());
        return oCuotaRepository.save(cuotaEntity);
    }

    public CuotaEntity update(CuotaEntity cuotaEntity) {
        CuotaEntity existingBlog = oCuotaRepository.findById(cuotaEntity.getId())
                .orElseThrow(() -> new RuntimeException("Recurso not found"));
        existingBlog.setDescripcion(cuotaEntity.getDescripcion());
        existingBlog.setCantidad(cuotaEntity.getCantidad());
        existingBlog.setFecha(cuotaEntity.getFecha());
        existingBlog.setIdEquipo(cuotaEntity.getIdEquipo());
        return oCuotaRepository.save(existingBlog);
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
        oCuotaRepository.deleteAll();
        oCuotaRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        Random rnd = new Random();
        String[] nombres = {"Matrícula", "Mensualidad", "Cuota Extra", "Inscripción", "Cuota Anual"};
        for (int i = 0; i < cantidad; i++) {
            CuotaEntity c = new CuotaEntity();
            c.setDescripcion(nombres[rnd.nextInt(nombres.length)] + " " + (rnd.nextInt(9000) + 1000));
            c.setCantidad(BigDecimal.valueOf(rnd.nextDouble() * 100.0 + 1.0));
            c.setFecha(LocalDateTime.now().minusDays(rnd.nextInt(365)));
            c.setIdEquipo((long) (rnd.nextInt(5) + 1));
            oCuotaRepository.save(c);
        }
        return cantidad;
    }

}
