package net.ausiasmarch.gesportin.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.CuotaEntity;
import net.ausiasmarch.gesportin.entity.EquipoEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.CuotaRepository;

@Service
public class CuotaService {
    
    @Autowired
    private CuotaRepository oCuotaRepository;

    public CuotaEntity get(Long id) {
        return oCuotaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cuota no encontrado con id: " + id));
    }

    public Page<CuotaEntity> getPage(Pageable pageable) {
        return oCuotaRepository.findAll(pageable);
    }

    public CuotaEntity create(CuotaEntity cuota) {
        cuota.setId(null);
        cuota.setFecha(LocalDateTime.now());
        return oCuotaRepository.save(cuota);
    }

    public CuotaEntity update(CuotaEntity cuota) {
        CuotaEntity existingCuota = oCuotaRepository.findById(cuota.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cuota no encontrado con id: " + cuota.getId()));
        existingCuota.setDescripcion(cuota.getDescripcion());
        existingCuota.setCantidad(cuota.getCantidad());
        existingCuota.setFecha(cuota.getFecha());
        existingCuota.setEquipo(cuota.getEquipo());
        return oCuotaRepository.save(existingCuota);
    }

    public Long delete(Long id) {
        CuotaEntity cuota = oCuotaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cuota no encontrado con id: " + id));
        oCuotaRepository.delete(cuota);
        return id;
    }

    public Long empty() {
        oCuotaRepository.deleteAll();
        oCuotaRepository.flush();
        return 0L;
    }

    public Long count() {
        return oCuotaRepository.count();
    }

    public Long fill(Long cantidad) {
        Random random = new Random();
        String[] nombres = {"Matrícula", "Mensualidad", "Cuota Extra", "Inscripción", "Cuota Anual"};
        for (int i = 0; i < cantidad; i++) {
            CuotaEntity cuota = new CuotaEntity();
            cuota.setDescripcion(nombres[random.nextInt(nombres.length)] + " " + (random.nextInt(9000) + 1000));
            cuota.setCantidad(BigDecimal.valueOf(random.nextDouble() * 100.0 + 1.0));
            cuota.setFecha(LocalDateTime.now().minusDays(random.nextInt(365)));
            EquipoEntity equipo = new EquipoEntity();
            equipo.setId(Long.valueOf(random.nextInt(50) + 1));
            cuota.setEquipo(equipo);
            oCuotaRepository.save(cuota);
        }
        return cantidad;
    }
}
