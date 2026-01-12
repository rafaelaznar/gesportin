package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.CuotaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.CuotaRepository;

@Service
public class CuotaService {
    
    @Autowired
    CuotaRepository oCuotaRepository;

    @Autowired
    SessionService oSessionService;

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

    public Long publicar(Long id) {
        if (!oSessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        CuotaEntity existingcuota = oCuotaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        oCuotaRepository.save(existingcuota);
        return existingcuota.getId();
    }

    public Long despublicar(Long id) {
        if (!oSessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        CuotaEntity existingcuota = oCuotaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        oCuotaRepository.save(existingcuota);
        return existingcuota.getId();
    }

    public Long empty() {
        if (!oSessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        Long total = oCuotaRepository.count();
        oCuotaRepository.deleteAll();
        return total;
    }

}
