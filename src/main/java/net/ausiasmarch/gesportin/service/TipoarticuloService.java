package net.ausiasmarch.gesportin.service;

//import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.TipoarticuloEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.TipoarticuloRepository;

@Service
public class TipoarticuloService {

    @Autowired
    private TipoarticuloRepository oTipoarticuloRepository;

    @Autowired
    private ClubService oClubService;

    //private final Random random = new Random();
    private final String[] descripciones = {
        "Equipación oficial", "Material deportivo", "Accesorios", "Calzado deportivo", "Ropa de entrenamiento",
        "Complementos", "Merchandising", "Artículos de portería", "Equipamiento técnico", "Protecciones",
        "Hidratación", "Balones", "Conos y marcadores", "Redes", "Arbitraje",
        "Gimnasio", "Fisioterapia", "Nutrición", "Tecnología deportiva", "Textil técnico",
        "Ropa casual", "Infantil", "Junior", "Senior", "Femenino",
        "Masculino", "Unisex", "Outlet", "Novedades", "Ofertas",
        "Premium", "Básico", "Profesional", "Amateur", "Escolar",
        "Competición", "Ocio", "Verano", "Invierno", "Todo el año",
        "Personalizable", "Edición limitada", "Coleccionismo", "Regalos", "Packs",
        "Temporal", "Permanente", "Exclusivo", "Popular", "Especial"
    };

    public TipoarticuloEntity get(Long id) {
        return oTipoarticuloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipoarticulo no encontrado con id: " + id));
    }

    public Page<TipoarticuloEntity> getPage(Pageable pageable, String descripcion, Long idClub) {
        if (descripcion != null && !descripcion.isEmpty()) {
            return oTipoarticuloRepository.findByDescripcionContainingIgnoreCase(descripcion, pageable);
        } else if (idClub != null) {
            return oTipoarticuloRepository.findByClubId(idClub, pageable);
        } else {
            return oTipoarticuloRepository.findAll(pageable);
        }
    }

    public TipoarticuloEntity create(TipoarticuloEntity tipoarticulo) {
        tipoarticulo.setId(null);
        return oTipoarticuloRepository.save(tipoarticulo);
    }

    public TipoarticuloEntity update(TipoarticuloEntity tipoarticulo) {
        TipoarticuloEntity tipoarticuloExistente = oTipoarticuloRepository.findById(tipoarticulo.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Tipoarticulo no encontrado con id: " + tipoarticulo.getId()));

        tipoarticuloExistente.setDescripcion(tipoarticulo.getDescripcion());
        tipoarticuloExistente.setClub(oClubService.getOneRandom());

        return oTipoarticuloRepository.save(tipoarticuloExistente);
    }

    public Long delete(Long id) {
        TipoarticuloEntity tipoarticulo = oTipoarticuloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipoarticulo no encontrado con id: " + id));
        oTipoarticuloRepository.delete(tipoarticulo);
        return id;
    }

    public Long empty() {
        oTipoarticuloRepository.deleteAll();
        oTipoarticuloRepository.flush();
        return 0L;
    }

    public Long count() {
        return oTipoarticuloRepository.count();
    }

    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {
            TipoarticuloEntity oTipoarticulo = new TipoarticuloEntity();
            oTipoarticulo.setDescripcion(descripciones[i % descripciones.length] + " " + (i + 1));
            oTipoarticulo.setClub(oClubService.getOneRandom());
            oTipoarticuloRepository.save(oTipoarticulo);
        }
        return cantidad;
    }

    public TipoarticuloEntity getOneRandom() {
        Long count = oTipoarticuloRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oTipoarticuloRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }
}
