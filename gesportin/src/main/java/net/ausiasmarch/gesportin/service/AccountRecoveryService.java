package net.ausiasmarch.gesportin.service;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.ausiasmarch.gesportin.dto.ChangePasswordDTO;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.UsuarioRepository;

@Service
public class AccountRecoveryService {

    private static final Logger logger = LoggerFactory.getLogger(AccountRecoveryService.class);

    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    private final PasswordHashService passwordHashService;

    public AccountRecoveryService(
            UsuarioRepository usuarioRepository,
            EmailService emailService,
            PasswordHashService passwordHashService) {
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
        this.passwordHashService = passwordHashService;
    }

    @Transactional
    public void requestPasswordRecovery(String email) {
        usuarioRepository.findFirstByEmailIgnoreCase(email).ifPresentOrElse(usuario -> {
            String tokenPassword = UUID.randomUUID().toString();
            usuario.setTokenPassword(tokenPassword);
            usuarioRepository.save(usuario);
            emailService.sendPasswordRecoveryEmail(usuario, tokenPassword);
            logger.info("Password recovery email requested for user {}", usuario.getUsername());
        }, () -> {
            logger.info("Password recovery requested for non-existing email");
        });
    }

    @Transactional
    public void changePassword(ChangePasswordDTO changePasswordDTO) {
        if (!changePasswordDTO.getPassword().equals(changePasswordDTO.getConfirmPassword())) {
            throw new UnauthorizedException("Las contraseñas no coinciden");
        }

        UsuarioEntity usuario = usuarioRepository.findFirstByTokenPassword(changePasswordDTO.getTokenPassword())
                .orElseThrow(() -> new ResourceNotFoundException("Token de recuperación no válido"));

        usuario.setPassword(passwordHashService.encodeIfNeeded(changePasswordDTO.getPassword()));
        usuario.setTokenPassword(null);
        usuarioRepository.save(usuario);
        emailService.sendPasswordChangedEmail(usuario);
    }
}
