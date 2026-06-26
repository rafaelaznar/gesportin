package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import net.ausiasmarch.gesportin.bean.SessionBean;
import net.ausiasmarch.gesportin.bean.TokenBean;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.UsuarioRepository;

@Service
public class SessionService {

    @Autowired
    private JWTService oJwtService;

    @Autowired
    private UsuarioRepository oUsuarioRepository;

    public TokenBean login(SessionBean oSessionBean) {
        UsuarioEntity oUsuarioEntity = oUsuarioRepository
                .findFirstByUsernameAndPassword(oSessionBean.getUsername(), oSessionBean.getPassword()).orElseThrow(() -> {
                    throw new UnauthorizedException("Usuario o contraseña incorrectos");
                });
        return (new TokenBean(oJwtService.generateJWT(oSessionBean.getUsername(), oUsuarioEntity.getId(),
                oUsuarioEntity.getTipousuario().getId(), oUsuarioEntity.getClub().getId())));
    }

    public boolean isSessionActive() {
        return getUsername() != null;
    }

    public String getUsername() {
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (requestAttributes == null) {
            return null;
        }
        return (String) requestAttributes.getAttribute("username", RequestAttributes.SCOPE_REQUEST);
    }

    public boolean isAdmin() {
        String username = getUsername();
        if (username == null) {
            return false;
        }
        UsuarioEntity oUsuarioEntity = oUsuarioRepository.findFirstByUsername(username).orElse(null);
        return oUsuarioEntity != null && oUsuarioEntity.getTipousuario().getId() == 1;
    }

    public boolean isEquipoAdmin() {
        String username = getUsername();
        if (username == null) {
            return false;
        }
        UsuarioEntity oUsuarioEntity = oUsuarioRepository.findFirstByUsername(username).orElse(null);
        return oUsuarioEntity != null && oUsuarioEntity.getTipousuario().getId() == 2;
    }

    public boolean isUsuario() {
        String username = getUsername();
        if (username == null) {
            return false;
        }
        UsuarioEntity oUsuarioEntity = oUsuarioRepository.findFirstByUsername(username).orElse(null);
        return oUsuarioEntity != null && oUsuarioEntity.getTipousuario().getId() == 3;
    }

    /**
     * Return the user id of the currently logged user (null if no session).
     */
    public Long getIdUsuario() {
        String username = getUsername();
        if (username == null) {
            return null;
        }
        UsuarioEntity oUsuarioEntity = oUsuarioRepository.findFirstByUsername(username).orElse(null);
        if (oUsuarioEntity == null) {
            return null;
        }
        return oUsuarioEntity.getId();
    }

    /**
     * Return the club id of the currently logged user (null if no session or no
     * club).
     * No puede haber nadie sin club así que si el usuario en sesión no tiene club, es un error de datos y se emite un UnauthorizedException. Esto es para proteger la integridad de los datos y evitar que un usuario sin club pueda realizar operaciones que requieren pertenecer a un club específico.
     */
    public Long getIdClub() {
        String username = getUsername();
        if (username == null) {
            return null;
        }
        UsuarioEntity oUsuarioEntity = oUsuarioRepository.findFirstByUsername(username).orElse(null);
        if (oUsuarioEntity == null || oUsuarioEntity.getClub() == null) {
            //return null;
            throw new UnauthorizedException("Acceso denegado: el usuario en sesión no tiene club asignado");
        }
        return oUsuarioEntity.getClub().getId();
    }

    /**
     * Helper that throws an exception if the current user is an equipo admin or a
     * regular user and the
     * provided club id does not match their club.
     */
    public void checkSameClub(Long clubId) {
        if (isEquipoAdmin() || isUsuario()) {
            Long myClub = getIdClub();
            if (myClub == null || clubId == null || !myClub.equals(clubId)) {
                throw new UnauthorizedException("Acceso denegado: solo puede operar sobre su propio club");
            }
        }
    }

    /**
     * Throws UnauthorizedException when the requester is an equipo admin. Use for
     * operations that this role is not allowed to perform at all (invoices, cart,
     * etc.)
     */
    public void denyEquipoAdmin() {
        if (isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: no tiene permisos en esta operación");
        }
    }

    /**
     * Throws UnauthorizedException when the requester is a regular usuario.
     */
    public void denyUsuario() {
        if (isUsuario()) {
            throw new UnauthorizedException("Acceso denegado: no tiene permisos en esta operación");
        }
    }

    /**
     * Throws UnauthorizedException unless the requester is an admin (tipousuario
     * id=1).
     * Use for fill/empty operations that only admins may perform.
     */
    public void requireAdmin() {
        if (!isAdmin()) {
            throw new UnauthorizedException("Acceso denegado: esta operación requiere permisos de administrador");
        }
    }

}
