package net.ausiasmarch.gesportin.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.dto.CategoriaDTO;
import net.ausiasmarch.gesportin.dtoconverter.CategoriaConverter;
import net.ausiasmarch.gesportin.entity.CategoriaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.CategoriaRepository;

@Service
public class CategoriaService {

    @Autowired
    private AleatorioService oAleatorioService;

    @Autowired
    private CategoriaRepository oCategoriaRepository;

    @Autowired
    private TemporadaService oTemporadaService;

    @Autowired
    private SessionService oSessionService;

    @Autowired
    private CategoriaConverter oCategoriaConverter;

    

    public CategoriaDTO get(Long id) {
        CategoriaEntity e = oCategoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long clubId = e.getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        return oCategoriaConverter.toDTO(e);
    }

    public Page<CategoriaDTO> getPage(Pageable pageable, Optional<String> nombre, Optional<Long> id_temporada) {
        if (oSessionService.isAdmin()) {
            // los admins pueden ver todas las categorias de todos los clubes
            if (nombre.isPresent() && !nombre.get().isEmpty()) {
                return oCategoriaConverter.toPageDTO(oCategoriaRepository.findByNombreContainingIgnoreCase(nombre.get(), pageable));
            } else if (id_temporada.isPresent()) {
                return oCategoriaConverter.toPageDTO(oCategoriaRepository.findByTemporadaId(id_temporada.get(), pageable));
            } else {
                return oCategoriaConverter.toPageDTO(oCategoriaRepository.findAll(pageable));
            }
        }
        if (oSessionService.isEquipoAdmin()) {
            // los admins de equipo pueden ver todas las categorias de todas las temporadas de su club
            // obtenemos el id del club del admin de equipo
            Long myClub = oSessionService.getIdClub();
            oSessionService.checkSameClub(myClub);
            if (nombre.isPresent() && !nombre.get().isEmpty()) {
                return oCategoriaConverter.toPageDTO(oCategoriaRepository.findByNombreContainingIgnoreCase(nombre.get(), pageable));
            } else if (id_temporada.isPresent()) {
                return oCategoriaConverter.toPageDTO(oCategoriaRepository.findByTemporadaId(id_temporada.get(), pageable));
            } else {
                return oCategoriaConverter.toPageDTO(oCategoriaRepository.findByTemporadaClubId(myClub, pageable));
            }
        }
        if (oSessionService.isUsuario()) {
            // los usuarios regulares solo pueden ver las categorias de las temporadas de su club
            Long myClub = oSessionService.getIdClub();
            oSessionService.checkSameClub(myClub);
            if (nombre.isPresent() && !nombre.get().isEmpty()) {
                return oCategoriaConverter.toPageDTO(oCategoriaRepository.findByNombreContainingIgnoreCase(nombre.get(), pageable));
            } else if (id_temporada.isPresent()) {
                return oCategoriaConverter.toPageDTO(oCategoriaRepository.findByTemporadaId(id_temporada.get(), pageable));
            } else {
                return oCategoriaConverter.toPageDTO(oCategoriaRepository.findByTemporadaClubId(myClub, pageable));
            }
        }
        // los no autenticados no pueden ver ninguna categoria
        throw new UnauthorizedException("Acceso denegado: autenticación requerida para ver categorias");
    }

    public CategoriaDTO create(CategoriaEntity oCategoriaEntity) {
        // regular usuarios cannot create categorias
        oSessionService.denyUsuario();
        oCategoriaEntity.setId(null);
        oCategoriaEntity.setTemporada(oTemporadaService.get(oCategoriaEntity.getTemporada().getId()));
        return oCategoriaConverter.toDTO(oCategoriaRepository.save(oCategoriaEntity));
    }

    public CategoriaDTO update(CategoriaEntity oCategoriaEntity) {
        // regular usuarios cannot modify categorias
        oSessionService.denyUsuario();
        CategoriaEntity oCategoriaExistente = oCategoriaRepository.findById(oCategoriaEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                "Categoria no encontrado con id: " + oCategoriaEntity.getId()));
        oCategoriaExistente.setNombre(oCategoriaEntity.getNombre());
        oCategoriaExistente.setTemporada(oTemporadaService.get(oCategoriaEntity.getTemporada().getId()));
        return oCategoriaConverter.toDTO(oCategoriaRepository.save(oCategoriaExistente));
    }

    public Long delete(Long id) {
        // regular usuarios cannot delete categorias
        oSessionService.denyUsuario();
        CategoriaEntity oCategoria = oCategoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin()) {
            oSessionService.checkSameClub(oCategoria.getTemporada().getClub().getId());
        }
        oCategoriaRepository.delete(oCategoria);
        return id;
    }

    public Long count() {
        return oCategoriaRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oCategoriaRepository.deleteAll();
        oCategoriaRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        for (long j = 0; j < cantidad; j++) {
            CategoriaEntity oCategoria = new CategoriaEntity();
            oCategoria.setNombre(oAleatorioService.getCategoriaAleatoria());
            oCategoria.setTemporada(oTemporadaService.getOneRandom());
            oCategoriaRepository.save(oCategoria);
        }
        return cantidad;
    }

    public CategoriaEntity getOneRandom() {
        Long count = oCategoriaRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oCategoriaRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }
}
