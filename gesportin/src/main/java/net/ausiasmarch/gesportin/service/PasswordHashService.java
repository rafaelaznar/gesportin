package net.ausiasmarch.gesportin.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.exception.GeneralException;

@Service
public class PasswordHashService {

    private static final Pattern SHA256_PATTERN = Pattern.compile("^[a-fA-F0-9]{64}$");

    public String encodeIfNeeded(String password) {
        if (password == null || password.isBlank()) {
            return password;
        }
        if (SHA256_PATTERN.matcher(password).matches()) {
            return password.toLowerCase();
        }
        return encode(password);
    }

    public String encode(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new GeneralException("No se pudo cifrar la contraseña");
        }
    }
}
