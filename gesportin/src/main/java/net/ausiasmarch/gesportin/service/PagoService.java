package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.CuotaEntity;
import net.ausiasmarch.gesportin.entity.JugadorEntity;
import net.ausiasmarch.gesportin.entity.PagoEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.CuotaRepository;
import net.ausiasmarch.gesportin.repository.JugadorRepository;
import net.ausiasmarch.gesportin.repository.PagoRepository;

@Service
public class PagoService {

    @Autowired
    PagoRepository oPagoRepository;

    @Autowired
    CuotaRepository oCuotaRepository;

    @Autowired
    JugadorRepository oJugadorRepository;

    @Autowired
    AleatorioService oAleatorioService;



    // ----------------------------CRUD---------------------------------
    public PagoEntity get(Long id) {
        return oPagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado con id: " + id));
    }

    public PagoEntity create(PagoEntity oPagoEntity) {
        oPagoEntity.setId(null);
        oPagoEntity.setFecha(LocalDateTime.now());
        
        if (oPagoEntity.getCuota() == null || oPagoEntity.getJugador() == null) {
            throw new IllegalArgumentException("La cuota y el jugador no pueden ser nulos");
        }

        CuotaEntity existingCuota= oCuotaRepository.findById(oPagoEntity.getCuota().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cuota no encontrada con id: " + oPagoEntity.getCuota().getId()));

        JugadorEntity existingJugador = oJugadorRepository.findById(oPagoEntity.getJugador().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado con id: " + oPagoEntity.getJugador().getId()));

        oPagoEntity.setCuota(existingCuota);
        oPagoEntity.setJugador(existingJugador);

        return oPagoRepository.save(oPagoEntity);
    }

    public PagoEntity update(PagoEntity oPagoEntity) {
        PagoEntity existingPago = oPagoRepository.findById(oPagoEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado con id: " + oPagoEntity.getId()));

        CuotaEntity existingCuota= oCuotaRepository.findById(oPagoEntity.getCuota().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cuota no encontrada con id: " + oPagoEntity.getCuota().getId()));

        JugadorEntity existingJugador = oJugadorRepository.findById(oPagoEntity.getJugador().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado con id: " + oPagoEntity.getJugador().getId()));

        existingPago.setCuota(existingCuota);
        existingPago.setJugador(existingJugador);
        existingPago.setAbonado(oPagoEntity.getAbonado());
        existingPago.setFecha(oPagoEntity.getFecha());

        return oPagoRepository.save(existingPago);
    }

    public Long delete(Long id) {
        PagoEntity pago = oPagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado con id: " + id));
        oPagoRepository.delete(pago);
        return id;
    }

    public Page<PagoEntity> getPage(Pageable oPageable) {
        return oPagoRepository.findAll(oPageable);
    }

    public Long count() {
        return oPagoRepository.count();
    }

    // vaciar tabla pago
    public Long empty() {
        Long total = oPagoRepository.count();
        oPagoRepository.deleteAll();
        oPagoRepository.flush();
        return total;
    }

    // llenar tabla pago con datos de prueba
    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {

            Long idCuotaAleatorio = (long) oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 50);
            Long idJugadorAleatorio = (long) oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 50);

            CuotaEntity cuota = oCuotaRepository.findById(idCuotaAleatorio)
                    .orElseThrow(() -> new ResourceNotFoundException("Cuota no encontrada con id: " + idCuotaAleatorio));

            JugadorEntity jugador = oJugadorRepository.findById(idJugadorAleatorio)
                    .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado con id: " + idJugadorAleatorio));

            PagoEntity pago = new PagoEntity();
            pago.setCuota(cuota);
            pago.setJugador(jugador);
            pago.setAbonado(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 1));
            pago.setFecha(LocalDateTime.now());

            oPagoRepository.save(pago);
        }
        return cantidad;
    }
}
