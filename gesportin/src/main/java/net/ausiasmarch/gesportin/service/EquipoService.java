package net.ausiasmarch.gesportin.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.EquipoEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.EquipoRepository;

@Service
public class EquipoService {

    @Autowired
    private EquipoRepository oEquipoRepository;

    @Autowired
    private UsuarioService oUsuarioService;

    @Autowired
    private CategoriaService oCategoriaService;

    @Autowired
    private TemporadaService oTemporadaService;

    @Autowired
    private AleatorioService oAleatorioService;

    @Autowired
    private SessionService oSessionService;

    public EquipoEntity get(Long id) {
        EquipoEntity e = oEquipoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipo no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long clubId = e.getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        return e;
    }

    public Page<EquipoEntity> getPage(Pageable pageable, String descripcion, Long id_categoria, Long id_usuario) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            // if filters specify something outside club, reject
            if (id_categoria != null) {
                Long clubCat = oCategoriaService.get(id_categoria).getTemporada().getClub().getId();
                if (!myClub.equals(clubCat)) {
                    throw new UnauthorizedException("Acceso denegado: solo equipos de su club");
                }
            }
            if (id_usuario != null) {
                Long clubUsr = oUsuarioService.get(id_usuario).getClub().getId();
                if (!myClub.equals(clubUsr)) {
                    throw new UnauthorizedException("Acceso denegado: solo equipos de su club");
                }
            }
            if (descripcion == null || descripcion.isEmpty()) {
                if (id_categoria != null) {
                    // id_categoria already validated to belong to same club above
                    return oEquipoRepository.findByCategoriaId(id_categoria, pageable);
                }
                // force club filter when no other filter provided
                return oEquipoRepository.findByCategoriaTemporadaClubId(myClub, pageable);
            } else {
                // description filter must be scoped to own club
                return oEquipoRepository.findByNombreContainingIgnoreCaseAndCategoriaTemporadaClubId(descripcion, myClub, pageable);
            }
        }
        if (descripcion != null && !descripcion.isEmpty()) {
            return oEquipoRepository.findByNombreContainingIgnoreCase(descripcion, pageable);
        } else if (id_categoria != null) {
            return oEquipoRepository.findByCategoriaId(id_categoria, pageable);
        } else if (id_usuario != null) {
            return oEquipoRepository.findByEntrenadorId(id_usuario, pageable);
        } else {
            return oEquipoRepository.findAll(pageable);
        }
    }

    public EquipoEntity create(EquipoEntity oEquipoEntity) {
        // regular usuarios cannot create equipos
        oSessionService.denyUsuario();
        if (oSessionService.isEquipoAdmin()) {
            Long clubId = oCategoriaService.get(oEquipoEntity.getCategoria().getId()).getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        oEquipoEntity.setId(null);
        oEquipoEntity.setEntrenador(oUsuarioService.get(oEquipoEntity.getEntrenador().getId()));
        oEquipoEntity.setCategoria(oCategoriaService.get(oEquipoEntity.getCategoria().getId()));
        return oEquipoRepository.save(oEquipoEntity);
    }

    public EquipoEntity update(EquipoEntity oEquipoEntity) {
        // regular usuarios cannot modify equipos
        oSessionService.denyUsuario();
        EquipoEntity oEquipoExistente = oEquipoRepository.findById(oEquipoEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                "Equipo no encontrado con id: " + oEquipoEntity.getId()));
        if (oSessionService.isEquipoAdmin()) {
            Long clubOld = oEquipoExistente.getCategoria().getTemporada().getClub().getId();
            Long clubNew = oCategoriaService.get(oEquipoEntity.getCategoria().getId()).getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubOld);
            oSessionService.checkSameClub(clubNew);
        }
        oEquipoExistente.setNombre(oEquipoEntity.getNombre());
        oEquipoExistente.setEntrenador(oUsuarioService.get(oEquipoEntity.getEntrenador().getId()));
        oEquipoExistente.setCategoria(oCategoriaService.get(oEquipoEntity.getCategoria().getId()));
        return oEquipoRepository.save(oEquipoExistente);
    }

    public Long delete(Long id) {
        // regular usuarios cannot delete equipos
        oSessionService.denyUsuario();
        EquipoEntity oEquipo = oEquipoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipo no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin()) {
            Long clubId = oEquipo.getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        oEquipoRepository.delete(oEquipo);
        return id;
    }

    public Long count() {
        return oEquipoRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oEquipoRepository.deleteAll();
        oEquipoRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        for (int i = 0; i < cantidad; i++) {
            EquipoEntity oEquipo = new EquipoEntity();
            oEquipo.setNombre(oAleatorioService.generarNombreEquipoAleatorio());
            // El entrenador debe pertenecer al mismo club que la categoría y tener tipousuario=3
            net.ausiasmarch.gesportin.entity.CategoriaEntity categoria = oCategoriaService.getOneRandom();
            Long clubId = categoria.getTemporada().getClub().getId();
            net.ausiasmarch.gesportin.entity.UsuarioEntity entrenador = oUsuarioService.getOneRandomFromClubAndTipousuario(clubId, 3L);
            if (entrenador == null) {
                // No hay entrenadores de club (tipousuario=3) en este club: saltamos
                continue;
            }
            oEquipo.setCategoria(categoria);
            oEquipo.setEntrenador(entrenador);
            oEquipoRepository.save(oEquipo);
        }
        return cantidad;
    }

    public EquipoEntity getOneRandom() {
        Long count = oEquipoRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oEquipoRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }

    public EquipoEntity getOneRandomFromClub(Long ClubId) {
        List<EquipoEntity> equipos = oEquipoRepository.getAllEquiposFromClub(ClubId);
        if (equipos.isEmpty()) {
            return null;
        } else {
            int index = oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, equipos.size() - 1);
            return equipos.get(index);
        }
    }

    public Long countByTemporada(Long id_temporada) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long clubId = oTemporadaService.get(id_temporada).getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        return oEquipoRepository.countByCategoriaTemporadaId(id_temporada);
    }

}
