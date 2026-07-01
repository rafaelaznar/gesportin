package net.ausiasmarch.gesportin.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.dto.ClubDTO;
import net.ausiasmarch.gesportin.entity.ArticuloEntity;
import net.ausiasmarch.gesportin.entity.CategoriaEntity;
import net.ausiasmarch.gesportin.entity.ClubEntity;
import net.ausiasmarch.gesportin.entity.ComentarioEntity;
import net.ausiasmarch.gesportin.entity.CompraEntity;
import net.ausiasmarch.gesportin.entity.EquipoEntity;
import net.ausiasmarch.gesportin.entity.JugadorEntity;
import net.ausiasmarch.gesportin.entity.NoticiaEntity;
import net.ausiasmarch.gesportin.entity.PuntuacionEntity;
import net.ausiasmarch.gesportin.entity.TemporadaEntity;
import net.ausiasmarch.gesportin.entity.TipoarticuloEntity;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotAllowedException;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.ArticuloRepository;
import net.ausiasmarch.gesportin.repository.CategoriaRepository;
import net.ausiasmarch.gesportin.repository.ClubRepository;
import net.ausiasmarch.gesportin.dtoconverter.ClubConverter;
import net.ausiasmarch.gesportin.repository.ComentarioRepository;
import net.ausiasmarch.gesportin.repository.CompraRepository;
import net.ausiasmarch.gesportin.repository.EquipoRepository;
import net.ausiasmarch.gesportin.repository.FacturaRepository;
import net.ausiasmarch.gesportin.repository.JugadorRepository;
import net.ausiasmarch.gesportin.repository.NoticiaRepository;
import net.ausiasmarch.gesportin.repository.PuntuacionRepository;
import net.ausiasmarch.gesportin.repository.RolusuarioRepository;
import net.ausiasmarch.gesportin.repository.TemporadaRepository;
import net.ausiasmarch.gesportin.repository.TipoarticuloRepository;
import net.ausiasmarch.gesportin.repository.TipousuarioRepository;
import net.ausiasmarch.gesportin.repository.UsuarioRepository;
import static net.ausiasmarch.gesportin.util.ImageValidator.isValidPicture;

@Service
public class ClubService {

    @Autowired
    private ClubRepository oClubRepository;

    @Autowired
    private NoticiaRepository oNoticiaRepository;

    @Autowired
    private TipoarticuloRepository oTipoarticuloRepository;

    @Autowired
    private TemporadaRepository oTemporadaRepository;

    @Autowired
    private UsuarioRepository oUsuarioRepository;

    @Autowired
    private ComentarioRepository oComentarioRepository;

    @Autowired
    private PuntuacionRepository oPuntuacionRepository;

    @Autowired
    private CompraRepository oCompraRepository;

    @Autowired
    private JugadorRepository oJugadorRepository;

    @Autowired
    private ArticuloRepository oArticuloRepository;

    @Autowired
    private EquipoRepository oEquipoRepository;

    @Autowired
    private CategoriaRepository oCategoriaRepository;

    @Autowired
    private FacturaRepository oFacturaRepository;

    @Autowired
    private SessionService oSessionService;

    @Autowired
    private TipousuarioRepository oTipousuarioRepository;

    @Autowired
    private RolusuarioRepository oRolusuarioRepository;

    @Autowired
    private ClubConverter oClubConverter;

    private final Random random = new Random();

    private final String[] descripciones1 = {
        "Atlético", "Deportivo", "Real club", "Unión deportiva",
        "Sociedad deportiva", "Socidad nacional", "Agrupación deportiva", "Club deportivo",
        "Asociación deportiva", "Federación deportiva", "Equipo deportivo", "Comunidad deportiva",
        "Círculo deportivo"};
    private final String[] descripciones2 = {
        "Fúbol", "Baloncesto", "Voleibol", "Hockey",
        "Rugby", "Tenis", "Natación", "Atletismo",
        "Ciclismo", "Boxeo", "Esgrima", "Gimnastia",
        "Piragüismo", "Remo", "Judo", "Taekwondo",
        "Karate", "Golf", "Surf", "Esquí"};
    private final String[] descripciones3 = {
        "Barcelona", "Madrid", "Valencia", "Sevilla",
        "Zaragoza", "Villarreal", "Granada", "Cádiz",
        "Bilbao", "San Sebastián", "Vigo", "La Coruña",
        "Mallorca", "Ibiza", "Tenerife", "Las Palmas"};
    private final String[] direcciones1 = {
        "Calle", "Avenida", "Plaza", "Camino", "Paseo", "Ronda", "Glorieta", "Travesía"};

    private final String[] nombres = {"Juan", "Carlos", "Luis", "Miguel", "Javier", "David", "Ángel", "Sergio",
        "Pablo", "Diego",
        "Manuel", "Francisco", "José", "Antonio", "Jesús", "Alberto", "Fernando", "Raúl", "Rubén", "Óscar"};

    private final String[] apellidos = {"García", "Martínez", "López", "Sánchez", "Pérez", "González", "Rodríguez",
        "Fernández",
        "Jiménez", "Moreno", "Muñoz", "Alonso", "Gutiérrez", "Romero", "Díaz", "Torres", "Ruiz", "Hernández",
        "Vázquez", "Castro"};

    public ClubDTO get(Long id) {
        // equipo administrators may only view their own club
        oSessionService.checkSameClub(id);
        return oClubConverter.toDTO(oClubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado con id: " + id)));
    }

    public Page<ClubDTO> getPage(Pageable pageable) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (myClub == null) {
                return org.springframework.data.domain.Page.empty(pageable);
            }
            ClubEntity club = oClubRepository.findById(myClub).orElse(null);
            if (club == null) {
                return org.springframework.data.domain.Page.empty(pageable);
            }
            java.util.List<ClubDTO> list = java.util.Collections.singletonList(oClubConverter.toDTO(club));
            return new org.springframework.data.domain.PageImpl<>(list, pageable, 1);
        }
        return oClubConverter.toPageDTO(oClubRepository.findAll(pageable));
    }

    public ClubDTO create(ClubEntity oClubEntity) {
        // equipo admins and regular usuarios are not allowed to create clubs
        oSessionService.denyEquipoAdmin();
        oSessionService.denyUsuario();
        oClubEntity.setId(null);
        oClubEntity.setFechaAlta(LocalDateTime.now());
        return oClubConverter.toDTO(oClubRepository.save(oClubEntity));
    }

    public ClubDTO update(ClubEntity oClubEntity) {
        // equipo admins and regular usuarios are not allowed to modify club data
        oSessionService.denyEquipoAdmin();
        oSessionService.denyUsuario();
        ClubEntity oClubExistente = oClubRepository.findById(oClubEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado con id: " + oClubEntity.getId()));

        oClubExistente.setNombre(oClubEntity.getNombre());
        oClubExistente.setDireccion(oClubEntity.getDireccion());
        oClubExistente.setTelefono(oClubEntity.getTelefono());
        oClubExistente.setFechaAlta(oClubEntity.getFechaAlta());
        oClubExistente.setImagen(oClubEntity.getImagen());
        return oClubConverter.toDTO(oClubRepository.save(oClubExistente));
    }

    public void updatePicture(Long id, byte[] newImage) throws IOException {
        // equipo admins and regular usuarios are not allowed to modify club data
        oSessionService.denyEquipoAdmin();
        oSessionService.denyUsuario();
        ClubEntity oClubExistente = oClubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado con id: " + id));

        if(!isValidPicture(newImage)) throw new ResourceNotAllowedException("This image is not allowed");
        oClubExistente.setImagen(newImage);
        oClubRepository.save(oClubExistente);
    }

    public Long delete(Long id) {
        // equipo admins and regular usuarios are not allowed to delete clubs
        oSessionService.denyEquipoAdmin();
        oSessionService.denyUsuario();
        ClubEntity oClub = oClubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado con id: " + id));
        oClubRepository.delete(oClub);
        return id;
    }

    public Long count() {
        // equipo admins and regular usuarios should only be aware of their own club count
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            return (oSessionService.getIdClub() != null) ? 1L : 0L;
        }
        return oClubRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oClubRepository.deleteAll();
        oClubRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        for (int i = 0; i < cantidad; i++) {
            ClubEntity oClub = new ClubEntity();
            String nombre = descripciones1[random.nextInt(descripciones1.length)] + " de "
                    + descripciones2[random.nextInt(descripciones2.length)] + " en "
                    + descripciones3[random.nextInt(descripciones3.length)];
            oClub.setNombre(nombre);
            String direccion = direcciones1[random.nextInt(direcciones1.length)] + " de "
                    + nombres[random.nextInt(nombres.length)] + " "
                    + apellidos[random.nextInt(apellidos.length)] + ", " + (random.nextInt(100) + 1);
            oClub.setDireccion(direccion);
            oClub.setTelefono("6" + (random.nextInt(900000) + 1000000));
            oClub.setFechaAlta(LocalDateTime.now());
            // oClub.setImagen(("imagen" + i).getBytes());
            oClubRepository.save(oClub);
        }
        return cantidad;
    }

    public ClubEntity getOneRandom() {
        Long count = oClubRepository.count();
        if (count == 0) {
            return null;
        }
        int index = random.nextInt(count.intValue());
        return oClubRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }

}
