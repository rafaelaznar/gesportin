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
import net.ausiasmarch.gesportin.repository.ArticuloRepository;

@Service
public class ArticuloService {

    @Autowired
    private ArticuloRepository oArticuloRepository;

    private final Random random = new Random();

    private final String[] descripciones = {
            "Camiseta oficial", "Pantalón corto", "Medias deportivas", "Balón oficial",
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

    public ArticuloEntity get(Long id) {
        return oArticuloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Articulo no encontrado con id: " + id));
    }

    public Page<ArticuloEntity> getPage(Pageable pageable, String descripcion, Long idTipoarticulo) {
        if (descripcion != null && !descripcion.isEmpty()) {
            return oArticuloRepository.findByDescripcionContainingIgnoreCase(descripcion, pageable);
        } /*else if (idTipoarticulo != null) {
            return oArticuloRepository.findByIdTipoarticulo(idTipoarticulo, pageable);        
        } */else {
            return oArticuloRepository.findAll(pageable);
        }
    }

    public ArticuloEntity create(ArticuloEntity articulo) {
        articulo.setId(null);
        return oArticuloRepository.save(articulo);
    }

    public ArticuloEntity update(ArticuloEntity oArticuloEntity) {
        ArticuloEntity oArticuloExistente = oArticuloRepository.findById(oArticuloEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Articulo no encontrado con id: " + oArticuloEntity.getId()));
        
        oArticuloExistente.setDescripcion(oArticuloEntity.getDescripcion());
        oArticuloExistente.setPrecio(oArticuloEntity.getPrecio());
        oArticuloExistente.setDescuento(oArticuloEntity.getDescuento());
        oArticuloExistente.setImagen(oArticuloEntity.getImagen());
        //oArticuloExistente.setIdTipoarticulo(oArticuloEntity.getIdTipoarticulo());        
        
        return oArticuloRepository.save(oArticuloExistente);
    }

    public Long delete(Long id) {
        ArticuloEntity oArticulo = oArticuloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Articulo no encontrado con id: " + id));
        oArticuloRepository.delete(oArticulo);
        return id;
    }

    public Long empty() {
        oArticuloRepository.deleteAll();
        oArticuloRepository.flush();
        return 0L;
    }

    public Long count() {
        return oArticuloRepository.count();
    }

    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {
            ArticuloEntity oArticulo = new ArticuloEntity();
            oArticulo.setDescripcion(descripciones[i % descripciones.length] + " " + (i + 1));
            oArticulo.setPrecio(BigDecimal.valueOf(random.nextDouble() * 100 + 5).setScale(2, RoundingMode.HALF_UP));
            oArticulo.setDescuento(random.nextBoolean() ? BigDecimal.valueOf(random.nextDouble() * 30).setScale(2, RoundingMode.HALF_UP) : null);
            //oArticulo.setIdTipoarticulo((Long) (long) (Long) (long)(random.nextInt(50) + 1));            
            oArticuloRepository.save(oArticulo);
        }
        return cantidad;
    }

}
