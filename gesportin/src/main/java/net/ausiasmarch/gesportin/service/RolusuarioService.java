package net.ausiasmarch.gesportin.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import net.ausiasmarch.gesportin.entity.RolusuarioEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.RolusuarioRepository;

@Service
public class RolusuarioService {

    @Autowired
    private RolusuarioRepository oRolusuarioRepository;

    @Autowired
    private SessionService oSessionService;

    // private final Random random = new Random();
    private final String[] descripciones = {
            "Presidente", "Vicepresidente", "Secretario", "Jugador",
            "Tesorero", "Vocal", "Coordinador", "Director Deportivo",
            "Entrenador", "Delegado", "Socio Honorífico",
            "Miembro del Comité", "Asesor Legal", "Responsable de Marketing", "Encargado de Eventos", "Jefe de Prensa",
            "Coordinador de Voluntarios",
            "Responsable de Infraestructuras", "Director de Comunicación", "Coordinador de Patrocinios",
            "Responsable de Relaciones Institucionales",
            "Patrocinador", "Colaborador", "Miembro del Consejo", "Responsable de Formación",
            "Encargado de Redes Sociales",
            "Responsable de Seguridad", "Coordinador de Actividades", "Jefe de Proyectos", "Responsable de Tecnología",
            "Encargado de Logística",
            "Árbitro", "Médico", "Fisioterapeuta", "Nutricionista", "Psicólogo Deportivo",
            "Analista de Datos", "Preparador Físico",
            "Scout", "Fotógrafo", "Videógrafo",
            "Periodista Deportivo", "Community Manager", "Diseñador Gráfico", "Desarrollador Web",
            "Administrador de Sistemas", "Especialista en SEO",
            "Consultor de Negocios", "Asistente Administrativo"
    };

    public RolusuarioEntity get(Long id) {
        return oRolusuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con id: " + id));
    }

    public List<RolusuarioEntity> all() {
        return oRolusuarioRepository.findAll();
    }

    public Page<RolusuarioEntity> getPage(Pageable oPageable, String descripcion) {
        if (descripcion != null && !descripcion.isEmpty()) {
            return oRolusuarioRepository.findByDescripcionContainingIgnoreCase(descripcion, oPageable);
        } else {
            return oRolusuarioRepository.findAll(oPageable);
        }
    }

    public RolusuarioEntity create(RolusuarioEntity oRolusuarioEntity) {
        oSessionService.requireAdmin();
        oRolusuarioEntity.setId(null);
        return oRolusuarioRepository.save(oRolusuarioEntity);
    }

    public RolusuarioEntity update(RolusuarioEntity oRolusuarioEntity) {
        oSessionService.requireAdmin();
        RolusuarioEntity oRolusuarioExistente = oRolusuarioRepository.findById(oRolusuarioEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Rol de usuario no encontrado con id: " + oRolusuarioEntity.getId()));
        oRolusuarioExistente.setDescripcion(oRolusuarioEntity.getDescripcion());
        return oRolusuarioRepository.save(oRolusuarioExistente);
    }

    public Long delete(Long id) {
        oSessionService.requireAdmin();
        RolusuarioEntity oRolusuario = oRolusuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rolusuario no encontrado con id: " + id));
        oRolusuarioRepository.delete(oRolusuario);
        return id;
    }

    public Long count() {
        return oRolusuarioRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oRolusuarioRepository.deleteAll();
        oRolusuarioRepository.flush();
        return 0L;
    }

    public Long fill() {
        oSessionService.requireAdmin();
        for (int i = 0; i < descripciones.length; i++) {
            RolusuarioEntity oRolusuario = new RolusuarioEntity();
            oRolusuario.setDescripcion(descripciones[i % descripciones.length]);
            oRolusuarioRepository.save(oRolusuario);
        }
        return (long) descripciones.length;
    }

    public RolusuarioEntity getOneRandom() {
        Long count = oRolusuarioRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oRolusuarioRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }
}
