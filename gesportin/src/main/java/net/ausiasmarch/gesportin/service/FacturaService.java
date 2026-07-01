package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.dto.FacturaDTO;
import net.ausiasmarch.gesportin.dtoconverter.FacturaConverter;
import net.ausiasmarch.gesportin.entity.FacturaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.FacturaRepository;

@Service
public class FacturaService {

    @Autowired
    private FacturaRepository oFacturaRepository;

    @Autowired
    private UsuarioService oUsuarioService;

    @Autowired
    private AleatorioService oAleatorioService;

    @Autowired
    private SessionService oSessionService;

    @Autowired
    private FacturaConverter oFacturaConverter;

    public FacturaDTO get(Long id) {
        FacturaEntity e = oFacturaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Factura no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin()) {
            Long clubId = e.getUsuario().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            if (!currentUserId.equals(e.getUsuario().getId())) {
                throw new UnauthorizedException("Acceso denegado: solo puede ver sus propias facturas");
            }
        }
        return oFacturaConverter.toDTO(e);
    }

    public Page<FacturaDTO> getPage(Pageable pageable, Long id_usuario, Long id_club) {
        if (oSessionService.isEquipoAdmin()) {
            Long myClub = oSessionService.getIdClub();
            if (id_usuario != null) {
                Long clubUsr = oUsuarioService.get(id_usuario).getClub().getId();
                if (!myClub.equals(clubUsr)) {
                    throw new UnauthorizedException("Acceso denegado: solo facturas de su club");
                }
            }
            if (id_club != null && !myClub.equals(id_club)) {
                throw new UnauthorizedException("Acceso denegado: solo facturas de su club");
            }
            // For non-admin users, always filter by their club
            id_club = myClub;
        }
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            if (id_usuario != null && !id_usuario.equals(currentUserId)) {
                throw new UnauthorizedException("Acceso denegado: solo puede ver sus propias facturas");
            }
            return oFacturaConverter.toPageDTO(oFacturaRepository.findByUsuarioId(currentUserId, pageable));
        }
        // Filter by usuario first (if specified, takes priority over club filter)
        if (id_usuario != null) {
            return oFacturaConverter.toPageDTO(oFacturaRepository.findByUsuarioId(id_usuario, pageable));
        }
        // Filter by club if specified (for admin users without a specific user)
        if (id_club != null) {
            return oFacturaConverter.toPageDTO(oFacturaRepository.findByUsuarioClubId(id_club, pageable));
        }
        return oFacturaConverter.toPageDTO(oFacturaRepository.findAll(pageable));
    }

    public FacturaDTO create(FacturaEntity oFacturaEntity) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: equipo‑admin no puede crear facturas");
        }
        if (oSessionService.isUsuario()) {
            throw new UnauthorizedException("Acceso denegado: utilice el proceso de compra para generar facturas");
        }
        oFacturaEntity.setUsuario(oUsuarioService.get(oFacturaEntity.getUsuario().getId()));
        oFacturaEntity.setId(null);
        oFacturaEntity.setFecha(LocalDateTime.now());
        FacturaEntity saved = oFacturaRepository.save(oFacturaEntity);
        return oFacturaConverter.toDTO(saved);
    }

    public FacturaDTO update(FacturaEntity oFacturaEntity) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: equipo‑admin no puede modificar facturas");
        }
        if (oSessionService.isUsuario()) {
            throw new UnauthorizedException("Acceso denegado: no puede modificar facturas");
        }
        FacturaEntity oFacturaExistente = oFacturaRepository.findById(oFacturaEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Factura no encontrado con id: " + oFacturaEntity.getId()));
        oFacturaExistente.setUsuario(oUsuarioService.get(oFacturaEntity.getUsuario().getId()));
        oFacturaExistente.setFecha(oFacturaEntity.getFecha());
        FacturaEntity saved = oFacturaRepository.save(oFacturaExistente);
        return oFacturaConverter.toDTO(saved);
    }

    public Long delete(Long id) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: equipo‑admin no puede borrar facturas");
        }
        if (oSessionService.isUsuario()) {
            throw new UnauthorizedException("Acceso denegado: no puede borrar facturas");
        }
        FacturaEntity oFactura = oFacturaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Factura no encontrado con id: " + id));
        oFacturaRepository.delete(oFactura);
        return id;
    }

    public Long count() {
        return oFacturaRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oFacturaRepository.deleteAll();
        oFacturaRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        for (int i = 0; i < cantidad; i++) {
            FacturaEntity oFactura = new FacturaEntity();
            // escoger una fecha de factura aleatoria en los ultimos 5 años
            oFactura.setFecha(LocalDateTime.now().minusDays(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 1825)));
            oFactura.setUsuario(oUsuarioService.getOneRandom());
            oFacturaRepository.save(oFactura);
        }
        return cantidad;
    }

    public FacturaEntity getOneRandom() {
        Long count = oFacturaRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oFacturaRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }

}
