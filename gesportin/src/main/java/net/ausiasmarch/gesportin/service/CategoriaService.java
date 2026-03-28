package net.ausiasmarch.gesportin.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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

    private static final String[] CATEGORIAS = {"Querubín", "Pre-benjamín", "Benjamín", "Alevín", "Infantil", "Cadete", "Juvenil", "Amateur"};

    public CategoriaEntity get(Long id) {
        CategoriaEntity e = oCategoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long clubId = e.getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        return e;
    }

    public Page<CategoriaEntity> getPage(Pageable pageable, Optional<String> nombre, Optional<Long> id_temporada) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (id_temporada.isPresent()) {
                Long clubTemporada = oTemporadaService.get(id_temporada.get()).getClub().getId();
                if (!myClub.equals(clubTemporada)) {
                    throw new UnauthorizedException("Acceso denegado: solo categorias de su club");
                }
            } else {
                // when no temporada filter provided, return only those belonging to the user's club
                return oCategoriaRepository.findByTemporadaClubId(myClub, pageable);
            }
        }
        if(nombre.isPresent() && !nombre.get().isEmpty()) {
            return oCategoriaRepository.findByNombreContainingIgnoreCase(nombre.get(), pageable);
        } else if( id_temporada.isPresent()) {
            return oCategoriaRepository.findByTemporadaId(id_temporada.get(), pageable);
        } else {
            return oCategoriaRepository.findAll(pageable);
        }
    }

    public CategoriaEntity create(CategoriaEntity oCategoriaEntity) {
        // regular usuarios cannot create categorias
        oSessionService.denyUsuario();
        oCategoriaEntity.setId(null);
        oCategoriaEntity.setTemporada(oTemporadaService.get(oCategoriaEntity.getTemporada().getId()));
        return oCategoriaRepository.save(oCategoriaEntity);
    }

    public CategoriaEntity update(CategoriaEntity oCategoriaEntity) {
        // regular usuarios cannot modify categorias
        oSessionService.denyUsuario();
        CategoriaEntity oCategoriaExistente = oCategoriaRepository.findById(oCategoriaEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Categoria no encontrado con id: " + oCategoriaEntity.getId()));
        oCategoriaExistente.setNombre(oCategoriaEntity.getNombre());
        oCategoriaExistente.setTemporada(oTemporadaService.get(oCategoriaEntity.getTemporada().getId()));
        return oCategoriaRepository.save(oCategoriaExistente);
    }

    public Long delete(Long id) {
        // regular usuarios cannot delete categorias
        oSessionService.denyUsuario();
        CategoriaEntity oCategoria = oCategoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrado con id: " + id));
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
            oCategoria.setNombre(CATEGORIAS[oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, CATEGORIAS.length - 1)]);
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
