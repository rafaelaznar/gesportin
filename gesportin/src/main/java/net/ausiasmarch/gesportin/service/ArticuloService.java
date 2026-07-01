package net.ausiasmarch.gesportin.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.dto.ArticuloDTO;
import net.ausiasmarch.gesportin.dtoconverter.ArticuloConverter;
import net.ausiasmarch.gesportin.entity.ArticuloEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.ArticuloRepository;

@Service
public class ArticuloService {

    @Autowired
    private ArticuloRepository oArticuloRepository;

    @Autowired
    private TipoarticuloService oTipoarticuloService;

    @Autowired
    private SessionService oSessionService;

    @Autowired
    private ArticuloConverter oArticuloConverter;

    @Autowired
    private AleatorioService oAleatorioService;

    private final Random random = new Random();

    public ArticuloDTO get(Long id) {
        ArticuloEntity e = oArticuloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Articulo no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long clubId = e.getTipoarticulo().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        return oArticuloConverter.toDTO(e);
    }

    public Page<ArticuloDTO> getPage(Pageable pageable, String descripcion, Long id_tipoarticulo, Long id_club) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (id_tipoarticulo != null) {
                Long clubTipo = oTipoarticuloService.get(id_tipoarticulo).getClub().getId();
                if (!myClub.equals(clubTipo)) {
                    throw new UnauthorizedException("Acceso denegado: solo articulos de su club");
                }
            }
            if (id_club != null && !myClub.equals(id_club)) {
                throw new UnauthorizedException("Acceso denegado: solo articulos de su club");
            }
            // For non-admin users, always filter by their club
            id_club = myClub;
        }
        // Filter by club if specified (for admin users who want to filter)
        if (id_club != null) {
            if (descripcion != null && !descripcion.isEmpty()) {
                return oArticuloConverter.toPageDTO(oArticuloRepository.findByDescripcionContainingIgnoreCaseAndTipoarticuloClubId(descripcion, id_club, pageable));
            } else if (id_tipoarticulo != null) {
                return oArticuloConverter.toPageDTO(oArticuloRepository.findByTipoarticuloId(id_tipoarticulo, pageable));
            } else {
                return oArticuloConverter.toPageDTO(oArticuloRepository.findByTipoarticuloClubId(id_club, pageable));
            }
        }
        if (descripcion != null && !descripcion.isEmpty()) {
            return oArticuloConverter.toPageDTO(oArticuloRepository.findByDescripcionContainingIgnoreCase(descripcion, pageable));
        } else if (id_tipoarticulo != null) {
            return oArticuloConverter.toPageDTO(oArticuloRepository.findByTipoarticuloId(id_tipoarticulo, pageable));
        } else {
            return oArticuloConverter.toPageDTO(oArticuloRepository.findAll(pageable));
        }
    }

    public ArticuloDTO create(ArticuloEntity oArticuloEntity) {
        // regular usuarios cannot create articulos
        oSessionService.denyUsuario();
        if (oSessionService.isEquipoAdmin()) {
            Long clubId = oTipoarticuloService.get(oArticuloEntity.getTipoarticulo().getId())
                    .getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        oArticuloEntity.setId(null);
        oArticuloEntity.setTipoarticulo(oTipoarticuloService.get(oArticuloEntity.getTipoarticulo().getId()));
        return oArticuloConverter.toDTO(oArticuloRepository.save(oArticuloEntity));
    }

    public ArticuloDTO update(ArticuloEntity oArticuloEntity) {
        // regular usuarios cannot modify articulos
        oSessionService.denyUsuario();
        ArticuloEntity oArticuloExistente = oArticuloRepository.findById(oArticuloEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                "Articulo no encontrado con id: " + oArticuloEntity.getId()));
        if (oSessionService.isEquipoAdmin()) {
            Long clubOld = oArticuloExistente.getTipoarticulo().getClub().getId();
            Long clubNew = oTipoarticuloService.get(oArticuloEntity.getTipoarticulo().getId())
                    .getClub().getId();
            oSessionService.checkSameClub(clubOld);
            oSessionService.checkSameClub(clubNew);
        }
        oArticuloExistente.setDescripcion(oArticuloEntity.getDescripcion());
        oArticuloExistente.setPrecio(oArticuloEntity.getPrecio());
        oArticuloExistente.setDescuento(oArticuloEntity.getDescuento());
        oArticuloExistente.setImagen(oArticuloEntity.getImagen());
        oArticuloExistente.setTipoarticulo(oTipoarticuloService.get(oArticuloEntity.getTipoarticulo().getId()));
        return oArticuloConverter.toDTO(oArticuloRepository.save(oArticuloExistente));
    }

    public Long delete(Long id) {
        // regular usuarios cannot delete articulos
        oSessionService.denyUsuario();
        ArticuloEntity oArticulo = oArticuloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Articulo no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin()) {
            Long clubId = oArticulo.getTipoarticulo().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        oArticuloRepository.delete(oArticulo);
        return id;
    }

    public Long count() {
        return oArticuloRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oArticuloRepository.deleteAll();
        oArticuloRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        for (int i = 0; i < cantidad; i++) {
            ArticuloEntity oArticulo = new ArticuloEntity();
            oArticulo.setDescripcion(oAleatorioService.getDescripcionArticulo());
            oArticulo.setPrecio(BigDecimal.valueOf(random.nextDouble() * 100 + 5).setScale(2, RoundingMode.HALF_UP));
            oArticulo.setDescuento(random.nextBoolean()
                    ? BigDecimal.valueOf(random.nextDouble() * 30).setScale(2, RoundingMode.HALF_UP)
                    : null);
            oArticulo.setTipoarticulo(oTipoarticuloService.getOneRandom());
            oArticuloRepository.save(oArticulo);
        }
        return cantidad;
    }

    public ArticuloEntity getOneRandom() {
        Long count = oArticuloRepository.count();
        if (count == 0) {
            return null;
        }
        int index = random.nextInt(count.intValue());
        return oArticuloRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }

    public ArticuloEntity getOneRandomFromClub(Long clubId) {
        long count = oArticuloRepository.findByTipoarticuloClubId(clubId, Pageable.ofSize(1)).getTotalElements();
        if (count == 0) {
            return null;
        }
        int index = random.nextInt((int) count);
        var page = oArticuloRepository.findByTipoarticuloClubId(clubId, Pageable.ofSize(1).withPage(index));
        return page.hasContent() ? page.getContent().get(0) : null;
    }

}
