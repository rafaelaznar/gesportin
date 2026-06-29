package net.ausiasmarch.gesportin.service;

//import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.dto.TipoarticuloDTO;
import net.ausiasmarch.gesportin.entity.TipoarticuloEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
//import net.ausiasmarch.gesportin.repository.CompraRepository;
import net.ausiasmarch.gesportin.repository.TipoarticuloRepository;
import net.ausiasmarch.gesportin.dtoconverter.TipoarticuloConverter;

@Service
public class TipoarticuloService {

    @Autowired
    private TipoarticuloRepository oTipoarticuloRepository;

    //@Autowired
    //private CompraRepository oCompraRepository;

    @Autowired
    private ClubService oClubService;

    @Autowired
    private SessionService oSessionService;

    @Autowired
    private TipoarticuloConverter oTipoarticuloConverter;

    @Autowired
    private AleatorioService oAleatorioService;


    public TipoarticuloDTO get(Long id) {
        TipoarticuloEntity e = oTipoarticuloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipoarticulo no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            oSessionService.checkSameClub(e.getClub().getId());
        }
        return oTipoarticuloConverter.toDTO(e);
    }

    public Page<TipoarticuloDTO> getPage(Pageable oPageable, String descripcion, Long idClub) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (idClub != null && !idClub.equals(myClub)) {
                throw new UnauthorizedException("Acceso denegado: solo tipos de artículo de su club");
            }
            idClub = myClub;
        }
        if (descripcion != null && !descripcion.isEmpty()) {
            if (idClub != null) {
                return oTipoarticuloConverter.toPageDTO(oTipoarticuloRepository.findByDescripcionContainingIgnoreCaseAndClubId(descripcion, idClub, oPageable));
            }
            return oTipoarticuloConverter.toPageDTO(oTipoarticuloRepository.findByDescripcionContainingIgnoreCase(descripcion, oPageable));
        } else if (idClub != null) {
            return oTipoarticuloConverter.toPageDTO(oTipoarticuloRepository.findByClubId(idClub, oPageable));
        } else {
            return oTipoarticuloConverter.toPageDTO(oTipoarticuloRepository.findAll(oPageable));
        }
    }

    public TipoarticuloDTO create(TipoarticuloEntity oTipoarticuloEntity) {
        // regular usuarios cannot create tipos de artículo
        oSessionService.denyUsuario();
        if (oSessionService.isEquipoAdmin()) {
            oSessionService.checkSameClub(oTipoarticuloEntity.getClub().getId());
        }
        oTipoarticuloEntity.setId(null);
        oTipoarticuloEntity.setClub(oClubService.get(oTipoarticuloEntity.getClub().getId()));
        return oTipoarticuloConverter.toDTO(oTipoarticuloRepository.save(oTipoarticuloEntity));
    }

    public TipoarticuloDTO update(TipoarticuloEntity oTipoarticuloEntity) {
        // regular usuarios cannot modify tipos de artículo
        oSessionService.denyUsuario();
        TipoarticuloEntity oTipoarticuloExistente = oTipoarticuloRepository.findById(oTipoarticuloEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Tipoarticulo no encontrado con id: " + oTipoarticuloEntity.getId()));
        if (oSessionService.isEquipoAdmin()) {
            oSessionService.checkSameClub(oTipoarticuloExistente.getClub().getId());
            oSessionService.checkSameClub(oTipoarticuloEntity.getClub().getId());
        }
        oTipoarticuloExistente.setDescripcion(oTipoarticuloEntity.getDescripcion());
        oTipoarticuloExistente.setClub(oClubService.get(oTipoarticuloEntity.getClub().getId()));
        return oTipoarticuloConverter.toDTO(oTipoarticuloRepository.save(oTipoarticuloExistente));
    }

    public Long delete(Long id) {
        // regular usuarios cannot delete tipos de artículo
        oSessionService.denyUsuario();
        TipoarticuloEntity oTipoarticulo = oTipoarticuloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipoarticulo no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin()) {
            oSessionService.checkSameClub(oTipoarticulo.getClub().getId());
        }
        oTipoarticuloRepository.delete(oTipoarticulo);
        return id;
    }

    public Long count() {
        return oTipoarticuloRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oTipoarticuloRepository.deleteAll();
        oTipoarticuloRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        String[] descripciones = oAleatorioService.getDescripcionesTipoArticulo();
        for (int i = 0; i < cantidad; i++) {
            TipoarticuloEntity oTipoarticulo = new TipoarticuloEntity();
            oTipoarticulo.setDescripcion(descripciones[i % descripciones.length]);
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
