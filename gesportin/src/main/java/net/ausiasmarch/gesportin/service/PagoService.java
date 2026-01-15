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

    public PagoEntity create(PagoEntity pagoEntity) {
        pagoEntity.setId(null);
        pagoEntity.setFecha(LocalDateTime.now());
        return oPagoRepository.save(pagoEntity);
    }

    public PagoEntity update(PagoEntity pagoEntity) {
        PagoEntity existingPago = oPagoRepository.findById(pagoEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado con id: " + pagoEntity.getId()));

        existingPago.setCuota(pagoEntity.getCuota());
        existingPago.setJugador(pagoEntity.getJugador());
        existingPago.setAbonado(pagoEntity.getAbonado());
        existingPago.setFecha(pagoEntity.getFecha());

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
