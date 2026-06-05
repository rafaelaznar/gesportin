package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.dto.PuntuacionartDTO;
import net.ausiasmarch.gesportin.entity.PuntuacionartEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.PuntuacionartRepository;
import net.ausiasmarch.gesportin.dtoconverter.PuntuacionartConverter;

@Service
public class PuntuacionartService {

    @Autowired
    private PuntuacionartRepository oPuntuacionartRepository;

    @Autowired
    private AleatorioService oAleatorioService;

    @Autowired
    private ArticuloService oArticuloService;

    @Autowired
    private UsuarioService oUsuarioService;

    @Autowired
    private SessionService oSessionService;

    @Autowired
    private PuntuacionartConverter oPuntuacionartConverter;

    public PuntuacionartDTO get(Long id) {
        PuntuacionartEntity e = oPuntuacionartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Puntuacionart no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long clubId = e.getArticulo().getTipoarticulo().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        return oPuntuacionartConverter.toDTO(e);
    }

    public Page<PuntuacionartDTO> getPage(Pageable pageable, Long id_articulo, Long id_usuario) {
        Page<PuntuacionartEntity> result;
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (id_articulo != null) {
                Long clubArt = oArticuloService.get(id_articulo).getTipoarticulo().getClub().getId();
                if (!myClub.equals(clubArt)) {
                    throw new UnauthorizedException("Acceso denegado: solo puntuaciones de su club");
                }
            }
            if (id_usuario != null) {
                if (oSessionService.isUsuario() && !id_usuario.equals(oSessionService.getIdUsuario())) {
                    throw new UnauthorizedException("Acceso denegado: solo puede ver sus propias puntuaciones");
                }
                Long clubUsr = oUsuarioService.get(id_usuario).getClub().getId();
                if (!myClub.equals(clubUsr)) {
                    throw new UnauthorizedException("Acceso denegado: solo puntuaciones de su club");
                }
            }
            if (id_articulo == null && id_usuario == null) {
                result = oPuntuacionartRepository.findByArticuloTipoarticuloClubId(myClub, pageable);
                return oPuntuacionartConverter.toPageDTO(result);
            }
        }
        if (id_articulo != null) {
            result = oPuntuacionartRepository.findByArticuloId(id_articulo, pageable);
        } else if (id_usuario != null) {
            result = oPuntuacionartRepository.findByUsuarioId(id_usuario, pageable);
        } else {
            result = oPuntuacionartRepository.findAll(pageable);
        }
        return oPuntuacionartConverter.toPageDTO(result);
    }

    public PuntuacionartDTO create(PuntuacionartEntity oPuntuacionartEntity) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: no puede gestionar puntuaciones");
        }
        var articulo = oArticuloService.get(oPuntuacionartEntity.getArticulo().getId());
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            oSessionService.checkSameClub(articulo.getTipoarticulo().getClub().getId());
            // Un usuario solo puede puntuar una vez por artículo
            if (oPuntuacionartRepository.existsByArticuloIdAndUsuarioId(articulo.getId(), currentUserId)) {
                throw new UnauthorizedException("Ya has puntuado este artículo. Usa actualizar para modificarlo.");
            }
            oPuntuacionartEntity.setUsuario(oUsuarioService.get(currentUserId));
        } else {
            oPuntuacionartEntity.setUsuario(oUsuarioService.get(oPuntuacionartEntity.getUsuario().getId()));
        }
        oPuntuacionartEntity.setId(null);
        oPuntuacionartEntity.setArticulo(articulo);
        PuntuacionartEntity saved = oPuntuacionartRepository.save(oPuntuacionartEntity);
        return oPuntuacionartConverter.toDTO(saved);
    }

    public PuntuacionartDTO update(PuntuacionartEntity oPuntuacionartEntity) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: no puede gestionar puntuaciones");
        }
        PuntuacionartEntity existing = oPuntuacionartRepository.findById(oPuntuacionartEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Puntuacionart no encontrado con id: " + oPuntuacionartEntity.getId()));
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            if (!currentUserId.equals(existing.getUsuario().getId())) {
                throw new UnauthorizedException("Acceso denegado: solo puede modificar sus propias puntuaciones");
            }
            oSessionService.checkSameClub(existing.getArticulo().getTipoarticulo().getClub().getId());
            existing.setUsuario(oUsuarioService.get(currentUserId));
        } else {
            existing.setUsuario(oUsuarioService.get(oPuntuacionartEntity.getUsuario().getId()));
        }
        existing.setPuntuacion(oPuntuacionartEntity.getPuntuacion());
        existing.setArticulo(oArticuloService.get(oPuntuacionartEntity.getArticulo().getId()));
        PuntuacionartEntity saved = oPuntuacionartRepository.save(existing);
        return oPuntuacionartConverter.toDTO(saved);
    }

    public Long delete(Long id) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: no puede gestionar puntuaciones");
        }
        PuntuacionartEntity e = oPuntuacionartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Puntuacionart no encontrado con id: " + id));
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            if (!currentUserId.equals(e.getUsuario().getId())) {
                throw new UnauthorizedException("Acceso denegado: solo puede borrar sus propias puntuaciones");
            }
            oSessionService.checkSameClub(e.getArticulo().getTipoarticulo().getClub().getId());
        }
        oPuntuacionartRepository.delete(e);
        return id;
    }

    public Long count() {
        return oPuntuacionartRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oPuntuacionartRepository.deleteAll();
        oPuntuacionartRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        for (int i = 0; i < cantidad; i++) {
            PuntuacionartEntity e = new PuntuacionartEntity();
            e.setPuntuacion(oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 5));
            net.ausiasmarch.gesportin.entity.ArticuloEntity articulo = oArticuloService.getOneRandom();
            Long clubId = articulo.getTipoarticulo().getClub().getId();
            net.ausiasmarch.gesportin.entity.UsuarioEntity usuario = oUsuarioService.getOneRandomFromClub(clubId);
            if (usuario == null) {
                continue;
            }
            if (oPuntuacionartRepository.existsByArticuloIdAndUsuarioId(articulo.getId(), usuario.getId())) {
                continue;
            }
            e.setArticulo(articulo);
            e.setUsuario(usuario);
            oPuntuacionartRepository.save(e);
        }
        return cantidad;
    }
}
