package net.ausiasmarch.gesportin.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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

    private final Random random = new Random();

    private final String[] descripciones = {
            "Camiseta", "Pantalón corto", "Medias deportivas", "Balón oficial",
            "Zapatillas de fútbol", "Guantes de portero", "Espinilleras", "Sudadera",
            "Chaqueta de chándal", "Mochila deportiva", "Botella de agua", "Bufanda del club",
            "Gorra deportiva", "Muñequeras", "Cinta para el pelo", "Rodilleras",
            "Protector bucal", "Silbato", "Cronómetro", "Conos de entrenamiento",
            "Petos de entrenamiento", "Red de portería", "Bomba de aire", "Aguja para balones",
            "Camiseta de entrenamiento", "Pantalón largo", "Bolsa de deporte", "Toalla",
            "Chanclas", "Calcetines térmicos", "Chubasquero", "Polo del club",
            "Bermudas", "Leggins deportivos", "Top deportivo", "Cortavientos",
            "Chaleco reflectante", "Gafas de sol deportivas", "Reloj deportivo", "Pulsera fitness",
            "Protector solar", "Vendas elásticas", "Spray frío", "Crema muscular",
            "Bidón isotérmico", "Portabotellas", "Silbato electrónico", "Tarjetas de árbitro",
            "Marcador deportivo", "Pizarra táctica"
    };

    private final String[] descripciones2 = {
            "oficial", "de entrenamiento", "de alta calidad", "resistente",
            "transpirable", "ajustable", "duradero", "verde", "azul", "rojo",
            "naranja", "de alto rendimiento", "de última generación", "de diseño ergonómico",
            "de diseño moderno", "de edición limitada", "con tecnología avanzada" };

    public ArticuloEntity get(Long id) {
        ArticuloEntity e = oArticuloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Articulo no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long clubId = e.getTipoarticulo().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        return e;
    }

    public Page<ArticuloEntity> getPage(Pageable pageable, String descripcion, Long id_tipoarticulo) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (id_tipoarticulo != null) {
                Long clubTipo = oTipoarticuloService.get(id_tipoarticulo).getClub().getId();
                if (!myClub.equals(clubTipo)) {
                    throw new UnauthorizedException("Acceso denegado: solo articulos de su club");
                }
            }
            if (descripcion != null && !descripcion.isEmpty() && id_tipoarticulo == null) {
                return oArticuloRepository.findByDescripcionContainingIgnoreCaseAndTipoarticuloClubId(descripcion, myClub, pageable);
            }
            if (descripcion == null || descripcion.isEmpty()) {
                if (id_tipoarticulo == null) {
                    return oArticuloRepository.findByTipoarticuloClubId(myClub, pageable);
                }
            }
        }
        if (descripcion != null && !descripcion.isEmpty()) {
            return oArticuloRepository.findByDescripcionContainingIgnoreCase(descripcion, pageable);
        } else if (id_tipoarticulo != null) {
            return oArticuloRepository.findByTipoarticuloId(id_tipoarticulo, pageable);
        } else {
            return oArticuloRepository.findAll(pageable);
        }
    }

    public ArticuloEntity create(ArticuloEntity oArticuloEntity) {
        // regular usuarios cannot create articulos
        oSessionService.denyUsuario();
        if (oSessionService.isEquipoAdmin()) {
            Long clubId = oTipoarticuloService.get(oArticuloEntity.getTipoarticulo().getId())
                    .getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        oArticuloEntity.setId(null);
        oArticuloEntity.setTipoarticulo(oTipoarticuloService.get(oArticuloEntity.getTipoarticulo().getId()));
        return oArticuloRepository.save(oArticuloEntity);
    }

    public ArticuloEntity update(ArticuloEntity oArticuloEntity) {
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
        return oArticuloRepository.save(oArticuloExistente);
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
            oArticulo.setDescripcion(descripciones[random.nextInt(descripciones.length)] + " "
                    + descripciones2[random.nextInt(descripciones2.length)]);
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

}
