package net.ausiasmarch.gesportin.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.exception.GeneralException;

@Service
public class EmailService {

    private static final String TEMPLATE = "email-template";
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;
    private final boolean mailEnabled;
    private final String mailUsername;
    private final String urlFront;

    public EmailService(
            JavaMailSender javaMailSender,
            TemplateEngine templateEngine,
            @Value("${mail.enabled:false}") boolean mailEnabled,
            @Value("${spring.mail.username}") String mailUsername,
            @Value("${mail.urlFront}") String urlFront) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
        this.mailEnabled = mailEnabled;
        this.mailUsername = mailUsername;
        this.urlFront = urlFront;
    }

    public void sendWelcomeEmail(UsuarioEntity usuario) {
        if (!canSendTo(usuario)) {
            return;
        }

        sendTemplateEmail(
                usuario.getEmail(),
                "Bienvenido a Gesportín",
                "Bienvenido a Gesportín",
                "Hola " + usuario.getNombre() + ", tu cuenta se ha creado correctamente.",
                "Ya puedes iniciar sesión con tu usuario: " + usuario.getUsername(),
                null,
                null);
    }

    public void sendPasswordRecoveryEmail(UsuarioEntity usuario, String tokenPassword) {
        if (!canSendTo(usuario)) {
            return;
        }

        sendTemplateEmail(
                usuario.getEmail(),
                "Recuperación de cuenta",
                "Recuperar contraseña",
                "Hola " + usuario.getNombre() + ", hemos recibido una solicitud para recuperar tu cuenta.",
                "Tu nombre de usuario es: " + usuario.getUsername()
                        + ". Si no has solicitado este cambio, puedes ignorar este correo.",
                "Cambiar contraseña",
                buildRecoveryUrl(tokenPassword));
    }

    public void sendPasswordChangedEmail(UsuarioEntity usuario) {
        if (!canSendTo(usuario)) {
            return;
        }

        sendTemplateEmail(
                usuario.getEmail(),
                "Contraseña actualizada",
                "Contraseña actualizada",
                "Hola " + usuario.getNombre() + ", tu contraseña se ha actualizado correctamente.",
                "Si no has realizado este cambio, contacta con el administrador de tu club.",
                null,
                null);
    }

    private void sendTemplateEmail(
            String mailTo,
            String subject,
            String title,
            String mainMessage,
            String secondaryMessage,
            String actionText,
            String actionUrl) {
        if (!mailEnabled) {
            logger.info("Email sending is disabled. Skipping email to {}", mailTo);
            return;
        }
        if (mailUsername == null || mailUsername.isBlank()) {
            throw new GeneralException("No se ha configurado el remitente de email");
        }

        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            Context context = new Context();
            context.setVariable("title", title);
            context.setVariable("mainMessage", mainMessage);
            context.setVariable("secondaryMessage", secondaryMessage);
            context.setVariable("actionText", actionText);
            context.setVariable("actionUrl", actionUrl);

            String htmlText = templateEngine.process(TEMPLATE, context);
            helper.setFrom(mailUsername);
            helper.setTo(mailTo);
            helper.setSubject(subject);
            helper.setText(htmlText, true);

            javaMailSender.send(mimeMessage);
            logger.info("Email sent to {} with subject {}", mailTo, subject);
        } catch (MessagingException | MailException e) {
            logger.error("Could not send email to {}", mailTo, e);
            throw new GeneralException("No se pudo enviar el email");
        }
    }

    private boolean canSendTo(UsuarioEntity usuario) {
        return usuario != null && usuario.getEmail() != null && !usuario.getEmail().isBlank();
    }

    private String buildRecoveryUrl(String tokenPassword) {
        return urlFront + tokenPassword;
    }
}
