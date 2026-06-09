package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.dto.NoticiaDTO;
import net.ausiasmarch.gesportin.dtoconverter.NoticiaConverter;
import net.ausiasmarch.gesportin.entity.NoticiaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.NoticiaRepository;

@Service
public class NoticiaService {

    @Autowired
    private NoticiaRepository oNoticiaRepository;

    @Autowired
    private AleatorioService oAleatorioService;

    @Autowired
    private ClubService oClubService;

    @Autowired
    private SessionService oSessionService;

    @Autowired
    private NoticiaConverter oNoticiaConverter;

    ArrayList<String> alFrases = new ArrayList<>();

    public NoticiaService() {
        alFrases.add("La vida es bella.");
        alFrases.add("El conocimiento es poder.");
        alFrases.add("La perseverancia es la clave del éxito.");
        alFrases.add("El tiempo es oro.");
        alFrases.add("La creatividad es la inteligencia divirtiéndose.");
        alFrases.add("Más vale tarde que nunca.");
        alFrases.add("El cambio es la única constante en la vida.");
        alFrases.add("La esperanza es lo último que se pierde.");
        alFrases.add("La unión hace la fuerza.");
        alFrases.add("El respeto es la base de toda relación.");
        alFrases.add("La comunicación es clave en cualquier relación.");
        alFrases.add("Más vale pájaro en mano que ciento volando.");
        alFrases.add("A mal tiempo, buena cara.");
        alFrases.add("El que no arriesga no gana.");
        alFrases.add("La suerte favorece a los audaces.");
        alFrases.add("El tiempo lo dirá.");
    }

    public NoticiaDTO get(Long id) {
        NoticiaEntity e = oNoticiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Noticia no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            oSessionService.checkSameClub(e.getClub().getId());
        }
        return oNoticiaConverter.toDTO(e);
    }

    public Page<NoticiaDTO> getPage(Pageable oPageable, String contenido, Long idClub) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (idClub != null && !idClub.equals(myClub)) {
                throw new UnauthorizedException("Acceso denegado: solo noticias de su club");
            }
            // force filter
            idClub = myClub;
        }
        if (contenido != null && !contenido.isEmpty()) {
            if (idClub != null) {
                return oNoticiaConverter.toPageDTO(oNoticiaRepository.findByClubIdAndTextoContainingIgnoreCase(idClub, contenido, oPageable));
            }
            return oNoticiaConverter.toPageDTO(oNoticiaRepository.findByTituloContainingIgnoreCaseOrContenidoContainingIgnoreCase(contenido, contenido, oPageable));
        } else if (idClub != null) {
            return oNoticiaConverter.toPageDTO(oNoticiaRepository.findByClubId(idClub, oPageable));
        } else {
            return oNoticiaConverter.toPageDTO(oNoticiaRepository.findAll(oPageable));
        }
    }

    public NoticiaDTO create(NoticiaEntity oNoticiaEntity) {
        // regular usuarios cannot create noticias
        oSessionService.denyUsuario();
        if (oSessionService.isEquipoAdmin()) {
            oSessionService.checkSameClub(oNoticiaEntity.getClub().getId());
        }
        oNoticiaEntity.setId(null);
        oNoticiaEntity.setFecha(LocalDateTime.now());
        oNoticiaEntity.setClub(oClubService.get(oNoticiaEntity.getClub().getId()));

        NoticiaEntity saved = oNoticiaRepository.save(oNoticiaEntity);
        return oNoticiaConverter.toDTO(saved);
    }

    public NoticiaDTO update(NoticiaEntity oNoticiaEntity) {
        // regular usuarios cannot modify noticias
        oSessionService.denyUsuario();
        NoticiaEntity oNoticiaExistente = oNoticiaRepository.findById(oNoticiaEntity.getId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Noticia no encontrado con id: " + oNoticiaEntity.getId()));
        if (oSessionService.isEquipoAdmin()) {
            oSessionService.checkSameClub(oNoticiaExistente.getClub().getId());
            oSessionService.checkSameClub(oNoticiaEntity.getClub().getId());
        }
        oNoticiaExistente.setTitulo(oNoticiaEntity.getTitulo());
        oNoticiaExistente.setContenido(oNoticiaEntity.getContenido());
        oNoticiaExistente.setFecha(oNoticiaEntity.getFecha());
        oNoticiaExistente.setImagen(oNoticiaEntity.getImagen());
        oNoticiaExistente.setClub(oClubService.get(oNoticiaEntity.getClub().getId()));
        NoticiaEntity saved = oNoticiaRepository.save(oNoticiaExistente);
        return oNoticiaConverter.toDTO(saved);
    }

    public Long delete(Long id) {
        // regular usuarios cannot delete noticias
        oSessionService.denyUsuario();
        NoticiaEntity oNoticia = oNoticiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Noticia no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin()) {
            oSessionService.checkSameClub(oNoticia.getClub().getId());
        }
        oNoticiaRepository.delete(oNoticia);
        return id;
    }

    public Long count() {
        return oNoticiaRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oNoticiaRepository.deleteAll();
        oNoticiaRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        for (long j = 0; j < cantidad; j++) {
            NoticiaEntity oNoticia = new NoticiaEntity();
            oNoticia.setTitulo(
                    alFrases.get(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, alFrases.size() - 1)));
            String contenidoGenerado = "";
            int numFrases = oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 30);
            for (int i = 1; i <= numFrases; i++) {
                contenidoGenerado += alFrases
                        .get(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, alFrases.size() - 1)) + " ";
                if (oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 10) == 1) {
                    contenidoGenerado += "\n";
                }
            }
            oNoticia.setContenido(contenidoGenerado.trim());
            oNoticia.setFecha(LocalDateTime.now());
            oNoticia.setClub(oClubService.getOneRandom());
            oNoticia.setImagen(null);
            oNoticiaRepository.save(oNoticia);
        }
        return cantidad;
    }

    public NoticiaEntity getOneRandom() {
        Long count = oNoticiaRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oNoticiaRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);

    }
}
